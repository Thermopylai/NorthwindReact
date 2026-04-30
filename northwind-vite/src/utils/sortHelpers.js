export const getEffectiveSort = (sortBy, descending, defaultSort) => {
  return {
    sortBy: sortBy || defaultSort.orderBy,
    descending: sortBy ? descending : defaultSort.descending
  }
}

export const getNextSortState = ({
  clickedColumn,
  currentSortBy,
  currentDescending,
  defaultSort,
  descendingFirstColumns = []
}) => {
  const effectiveSortBy = currentSortBy || defaultSort.orderBy
  const effectiveDescending = currentSortBy
    ? currentDescending
    : defaultSort.descending

  const isSameColumn = effectiveSortBy === clickedColumn
  const isDefaultSort =
    currentSortBy === defaultSort.orderBy &&
    currentDescending === defaultSort.descending

  if (!isSameColumn && isDefaultSort && descendingFirstColumns.includes(clickedColumn)) {
    return {
      orderBy: clickedColumn,
      descending: true
    }
  }

  return {
    orderBy: clickedColumn,
    descending: isSameColumn ? !effectiveDescending : false
  }
}
