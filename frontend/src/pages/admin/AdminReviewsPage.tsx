import { useEffect, useState } from 'react';
import { reviewsService } from '../../services/reviews.service';
import { Badge, Card, EmptyState, PageLoader } from '../../components/ui';
import type { Review } from '../../types';

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  function load() {
    reviewsService.findAll({ approvedOnly: false }).then(setReviews);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await reviewsService.approve(id);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet avis ?')) return;
    await reviewsService.remove(id);
    load();
  }

  if (!reviews) {
    return <PageLoader />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text">Avis clients</h1>

      {reviews.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Aucun avis pour le moment" />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">
                    {review.customer?.user?.firstName} {review.customer?.user?.lastName} · {review.rating}/5
                  </p>
                  {review.title && <p className="text-sm text-text">{review.title}</p>}
                </div>
                <Badge className={review.approved ? 'bg-primary-soft text-primary-dark' : 'bg-amber-100 text-amber-800'}>
                  {review.approved ? 'Publié' : 'En attente'}
                </Badge>
              </div>
              {review.comment && <p className="mt-2 text-sm text-muted">{review.comment}</p>}
              <div className="mt-3 flex gap-3">
                {!review.approved && (
                  <button onClick={() => approve(review.id)} className="text-sm font-medium text-primary">
                    Approuver
                  </button>
                )}
                <button onClick={() => remove(review.id)} className="text-sm font-medium text-danger">
                  Supprimer
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
