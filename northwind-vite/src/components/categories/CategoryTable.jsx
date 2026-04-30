import ProductsPanel from "../products/ProductsPanel";
import { Fragment } from "react";
import PermissionGate from "../../auth/PermissionGate";

const formatPercent = (value) => {
  if (value == null) {
    return "-";
  }

  return Number(value).toLocaleString("fi-FI", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  onRestore,
  selectedCategoryId,
  showDetails,
  onToggleDetails,
  suppliers,
  onRefreshCategories,
}) => {
  if (!categories.length) {
    return <p>Ei kategorioita.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="text-nowrap">
        <tr>
          <th>ID</th>
          <th>Nimi</th>
          <th>Kuvaus</th>
          <th>Verokanta</th>
          <th>Tuotteita</th>
          <th>Kuva</th>
          <th>Poistettu</th>
          <th>Toiminnot</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => {
          const isOpen =
            selectedCategoryId === category.categoryID && showDetails;
          const isDeleted = category.isDeleted;

          return (
            <Fragment key={category.categoryID}>
              <tr
                id={`category-row-${category.categoryID}`}
                className={
                  isOpen ? "table-primary" : isDeleted ? "table-danger" : ""
                }
              >
                <td>#{category.categoryID}</td>
                <td>{category.categoryName}</td>
                <td>{category.description}</td>
                <td>{formatPercent(category.vatRate)}</td>
                <td>
                  {category.productCount != null
                    ? `${category.productCount} kpl`
                    : "-"}
                </td>
                <td>
                  {category.picture ? (
                    <img
                      src={`data:image/jpeg;base64,${category.picture}`}
                      alt={category.categoryName}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  ) : (
                    <span>Ei kuvaa</span>
                  )}
                </td>
                <td>
                  {isDeleted ? "Kyllä" : "Ei"}
                </td>
                <td className="text-nowrap">
                  <button
                    className={`me-1 btn btn-sm ${isOpen ? "btn-outline-primary" : "btn-primary"}`}
                    onClick={() => onToggleDetails(category.categoryID)}
                  >
                    {isOpen
                      ? "▼ Piilota rivit"
                      : `▶ Näytä rivit (${category.productCount != null ? `${category.productCount} kpl` : "-"})`}
                  </button>
                  <PermissionGate permission="categories.manage">
                    {isDeleted ? (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => onRestore(category.categoryID)}
                      >
                        Palauta
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => onEdit(category.categoryID)}
                        >
                          Muokkaa
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(category.categoryID)}
                        >
                          Poista
                        </button>
                      </>
                    )}
                  </PermissionGate>
                </td>
              </tr>

              {isOpen && (
                <tr>
                  <td colSpan="12" className="p-0 border-0">
                    <div className="border-start border-bottom border-4 border-primary rounded-bottom p-3">
                      <ProductsPanel
                        categoryId={category.categoryID}
                        suppliers={suppliers}
                        categories={categories}
                        pageSize={category.productCount}
                        onRefreshCategories={onRefreshCategories}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default CategoryTable;
