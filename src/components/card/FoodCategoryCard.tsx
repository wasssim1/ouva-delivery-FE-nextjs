import { useTranslations } from "next-intl";
import { MdFastfood } from "react-icons/md";

interface ICardsCategory {
  slug: string;
  imgSRC: string;
  selectedCategory: string;
  setSelectedCuisine: any;
  CompIcon?: any;
}

const CardsCategory: React.FC<ICardsCategory> = ({
  slug,
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
        width={70}
        height={70}
        className="cursor-pointer rounded-xl hover:opacity-80 px-1"
        // onClick={selectCuisineFunction}
      /> */}
      <div className="flex justify-center p-3">
        <MdFastfood size={30} className="text-3xl" />
      </div>
      <p
        className="font-bold text-sm capitalize"
        title={t(`foodCategories.${slug}`)}
      >
        {t(`foodCategories.${slug}`)}
      </p>
    </div>
  );
};

export default CardsCategory;
