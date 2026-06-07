import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Declaratively handle all React Query render states.
 *
 * Usage:
 *   const query = useTicketList(filters);
 *   <QueryStateHandler query={query}>
 *     {(data) => <TicketTable tickets={data.content} />}
 *   </QueryStateHandler>
 */
const QueryStateHandler = ({
  query,
  children,
  loadingFallback,
  errorFallback,
  emptyFallback,
  isEmpty,
}) => {
  const { data, isLoading, isPending, isError, error } = query;

  if (isLoading || isPending) {
    return (
      loadingFallback ?? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )
    );
  }

  if (isError) {
    return (
      errorFallback ?? (
        <div className="text-danger" style={{ padding: '1rem', textAlign: 'center' }}>
          {error?.message || 'An unexpected error occurred.'}
        </div>
      )
    );
  }

  const dataIsEmpty =
    typeof isEmpty === 'function'
      ? isEmpty(data)
      : data == null ||
        (Array.isArray(data) && data.length === 0) ||
        (data?.content && data.content.length === 0);

  if (dataIsEmpty) {
    return (
      emptyFallback ?? (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#6c757d' }}>
          No data found.
        </div>
      )
    );
  }

  return children(data);
};

export default QueryStateHandler;
