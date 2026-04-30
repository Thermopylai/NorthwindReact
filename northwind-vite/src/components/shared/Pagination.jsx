const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="text-center my-3">
      <button
        className="me-1 btn btn-secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Edellinen
      </button>

      <span>
        Sivu {page} / {totalPages}
      </span>

      <button
        className="ms-1 btn btn-secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Seuraava
      </button>
    </div>
  );
};

export default Pagination;
