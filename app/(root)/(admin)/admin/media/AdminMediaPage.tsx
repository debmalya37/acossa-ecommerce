'use client';

import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import Media from '@/components/Application/Admin/Media';
import UploadMedia from '@/components/Application/Admin/UploadMedia';
import ButtonLoading from '@/components/Application/LoadingButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// =============================
// Types
// =============================

type DeleteType = 'SD' | 'PD' | 'RSD';

export interface MediaItem {
  _id: string;
  asset_id: string;
  public_id: string;
  path: string;
  thumbnail_url: string;
  alt?: string;
  title?: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  mediaData: MediaItem[];
  hasMore: boolean;
}

// =============================
// Breadcrumb
// =============================

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_MEDIA_SHOW, label: 'Media' }
];

// =============================
// Page Component
// =============================

const AdminMedia = () => {
  const queryClient = useQueryClient();

  const [deleteType, setDeleteType] = useState<DeleteType>('SD');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const searchParams = useSearchParams();

  // Update deleteType based on query param
  useEffect(() => {
    const trashOf = searchParams.get('trashof');
    setSelectedMedia([]);
    setDeleteType(trashOf ? 'PD' : 'SD');
  }, [searchParams]);

  // Fetch media API
  const fetchMedia = async (
    page: number,
    type: DeleteType
  ): Promise<MediaResponse> => {
    const { data } = await axios.get<MediaResponse>(
      `/api/media?page=${page}&limit=10&deleteType=${type}`
    );
    return data;
  };

  // Delete mutation
  const deleteMutation = useDeleteMutation('media-data', '/api/media/delete');

  const handleDelete = (ids: string[], type: DeleteType) => {
    let allow = true;

    if (type === 'PD') {
      allow = confirm('Are you sure you want to delete permanently?');
    }

    if (allow) {
      deleteMutation.mutate({ ids, deleteType: type });
    }

    setSelectAll(false);
    setSelectedMedia([]);
  };

  // Select All toggle
  const handleSelectAll = () => {
    setSelectAll(prev => !prev);
  };

  // If selectAll = true → pull all IDs
  const {
    data,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['media-data', deleteType],
    queryFn: async ({ pageParam = 0 }) =>
      await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return lastPage.hasMore ? nextPage : undefined;
    }
  });

  useEffect(() => {
    if (selectAll && data) {
      const allIds = data.pages.flatMap(page =>
        page.mediaData.map(media => media._id)
      );
      setSelectedMedia(allIds);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll, data]);

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === 'SD' ? 'Media' : 'Media Trash'}
            </h4>

            <div className="flex items-center gap-5">
              {deleteType === 'SD' && (
                <UploadMedia isMultiple={true} queryClient={queryClient} />
              )}

              <div className="flex gap-3">
                {deleteType === 'SD' ? (
                  <Button type="button" variant="destructive">
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
                  </Button>
                ) : (
                  <Button type="button">
                    <Link href={ADMIN_MEDIA_SHOW}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-5">
          {/* Bulk Actions */}
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center">
              <Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="border-primary"
                  />
                  Select All
                </div>
              </Label>

              <div className="flex gap-2">
                {deleteType === 'SD' ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMedia, 'SD')}
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleDelete(selectedMedia, 'RSD')}
                    >
                      Restore
                    </Button>

                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleDelete(selectedMedia, 'PD')}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          {status === 'pending' ? (
            <div>Loading...</div>
          ) : status === 'error' ? (
            <div className="text-red-500 text-sm">
              {(error as Error).message}
            </div>
          ) : (
            <>
              {data?.pages?.flatMap(p => p.mediaData).length === 0 && (
                <div className="text-center">No data found.</div>
              )}

              {/* Media Grid */}
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {data?.pages?.map((page, index) => (
  <div key={index}>
    {(page?.mediaData ?? []).map((media) => (
      <Media
        key={media._id}
        media={media}
        deleteType={deleteType}
        handleDelete={handleDelete}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
      />
    ))}
  </div>
))}

              </div>

              {/* Pagination */}
              {hasNextPage ? (
                <div className="flex justify-center py-5">
                  <ButtonLoading
                    type="button"
                    loading={isFetching}
                    text="Load More"
                    onClick={() => fetchNextPage()}
                  />
                </div>
              ) : (
                <p className="text-center py-5 dark:text-white text-black">
                  Nothing more to load.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedia;
