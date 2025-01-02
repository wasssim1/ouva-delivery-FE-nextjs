import { useTranslations } from "next-intl";

interface ICardsCategory {
  slug: string;
  title: string;
  imgSRC: string;
  selectedCategory: string;
  setSelectedCuisine: any;
  CompIcon?: any;
}

const CardsCategory: React.FC<ICardsCategory> = ({
  slug,
  title,
  imgSRC,
  selectedCategory,
  setSelectedCuisine,
  CompIcon,
}) => {
  const t = useTranslations();

  const selectCuisineFunction = () => {
    if (selectedCategory === slug) {
      setSelectedCuisine("");
    } else {
      setSelectedCuisine(slug);
    }
  };

  return (
    <div
      className={`cursor-pointer shadow shadow-primary rounded-xl hover:opacity-80 text-center w-auto p-1 ${
        selectedCategory === slug
          ? "bg-primary text-white"
          : "bg-white text-primary"
      }`}
      onClick={selectCuisineFunction}
    >
      {/* <Image
        src={`/${imgSRC}`}
        alt={title}
        title={title}
        width={130}
        height={130}
        className="cursor-pointer rounded-xl hover:opacity-80 px-1"
        // onClick={selectCuisineFunction}
      /> */}
      <div className="flex justify-center">
        <CompIcon className="text-3xl" />
      </div>
      <p className="font-bold text-sm" title={title}>
        {t(`cuisines.` + title)
          .charAt(0)
          .toUpperCase() + t(`cuisines.` + title).slice(1)}
      </p>
    </div>
  );
};

export default CardsCategory;
