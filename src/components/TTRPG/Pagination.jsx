const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-container">
      <button onClick={() => onPageChange(currentPage - 1)}>&lt;</button>
      
      {/* Dynamic page numbers */}
      <span className="active-page">{currentPage}</span>
      
      <button onClick={() => onPageChange(currentPage + 1)}>&gt;</button>
      
      <select className="page-size-select">
        <option>10</option>
        <option>20</option>
      </select>
    </div>
  );
};