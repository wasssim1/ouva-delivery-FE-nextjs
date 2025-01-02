import { useMediaQuery } from "react-amazing-hooks";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

import { useTranslations } from "use-intl";
import { Button } from "./ui/button";

interface ListPaginationControlProps {
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  hasNextPage: boolean;
  showAllItems: boolean;
  setShowAllItems: (showAllItems: boolean) => void;
}

export function ListPaginationControl({
  itemsPerPage,
  currentPage,
  setCurrentPage,
  hasNextPage,
  showAllItems,
  setShowAllItems,
}: ListPaginationControlProps) {
  const isPaginationVisible = useMediaQuery({ min: 990 });
  const t = useTranslations();

  // const [itemsPerPage] = useState(8);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [hasNextPage, setHasNextPage] = useState(true);
  // const [showAllItems, setShowAllItems] = useState(false);

  // search filter based on the selected cuisine
  // const localiFiltrati = useMemo(() => {
  //   // @ts-ignore
  //   return cuisineDataMap[selectedCuisine] || [];
  // }, [cuisineDataMap, selectedCuisine]);

  // search filter function
  // const filterLocali = useCallback(
  //   (locali: any) => {
  //     return locali.filter(
  //       (ristorante: any) =>
  //         ristorante.name.toLowerCase().includes(searchText.toLowerCase()) || // .. name
  //         ristorante.address.street
  //           .toLowerCase()
  //           .includes(searchText.toLowerCase()) || // .. street
  //         ristorante.address.city
  //           .toLowerCase()
  //           .includes(searchText.toLowerCase()) // .. city
  //     );
  //   },
  //   [searchText]
  // );

  // get the restaurants currently displayed on the page
  // const getCurrentPageItems = () => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   return filterLocali(localiFiltrati).slice(startIndex, endIndex);
  // };

  // handle if there are more pages to show
  // const checkHasNextPage = useCallback(() => {
  //   const totalItems = filterLocali(localiFiltrati).length;
  //   const totalPages = Math.ceil(totalItems / itemsPerPage);
  //   setHasNextPage(currentPage < totalPages);
  // }, [currentPage, itemsPerPage, filterLocali, localiFiltrati]);

  // call the "checkHasNextPage" function to ensure the state is updated
  // useEffect(() => {
  //   checkHasNextPage();
  // }, [checkHasNextPage]);

  // reset the initial page when selecting a new category or using the search filter via the input field
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [selectedCuisine, searchText]);

  return (
    <>
      {isPaginationVisible &&
      filterLocali(localiFiltrati).length > itemsPerPage ? (
        <div className="flex justify-between mt-8">
          <div>
            <Button
              onClick={() => {
                setCurrentPage(1);
                setShowAllItems(!showAllItems);
              }}
              type="button"
              size={"xs"}
              variant={"ghost"}
              className="px-2 text-black rounded-sm bg-slate-200 hover:bg-slate-300 custom-shadow-sm text-base relative top-1"
            >
              {showAllItems ? t("common.hide") : t("common.showAll")}
            </Button>
          </div>
          {!showAllItems && (
            <div className="flex gap-2 w-40 pr-2">
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setCurrentPage((prevPage: number) =>
                    Math.max(prevPage - 1, 1)
                  );
                }}
                disabled={currentPage === 1}
                type="button"
                className={`bg-slate-200 hover:bg-slate-300 text-black px-1 rounded-md w-14 custom-shadow-sm ${
                  currentPage === 1 ? "opacity-50" : ""
                }`}
              >
                <MdArrowBackIos />
              </Button>

              <Button
                onClick={(event) => {
                  setCurrentPage((prevPage) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (
                      prevPage * itemsPerPage <
                      filterLocali(localiFiltrati).length
                    ) {
                      return prevPage + 1;
                    } else {
                      return prevPage;
                    }
                  });
                }}
                type="button"
                disabled={!hasNextPage}
                className={`bg-slate-200 hover:bg-slate-300 text-black px-1 rounded-md w-14 custom-shadow-sm ${
                  !hasNextPage ? "opacity-50" : ""
                }`}
              >
                <MdArrowForwardIos />
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
