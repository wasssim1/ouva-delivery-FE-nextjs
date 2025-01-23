"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import Select from "react-select";

type AddressLookupResultItem = {
  formatted: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  zone: string;
  addressComponents?: any;
};

interface SearchComboboxProps {
  apiSearchEndpoint?: string;
  selectedAddress: AddressLookupResultItem;
  onSelect: (addressData: AddressLookupResultItem) => void;
}

export function SearchCombobox({
  //   apiSearchEndpoint = `${process.env.NEXT_PUBLIC_OUVA_API_URL}/address/lookup`,
  apiSearchEndpoint = `/api/address/lookup`,
  selectedAddress,
  onSelect,
}: SearchComboboxProps) {
  const t = useTranslations();

  // const dispatch = useDispatch();
  // const userInfo = useSelector((state: RootState) => state.user);

  const [inputSearch, setInputSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchResultList, setSearchResultList] = useState<
    AddressLookupResultItem[]
  >([]);
  const [optionsList, setOptionsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputSearchChange = async (inputValue: string) => {
    setInputSearch(inputValue);
    if (inputValue.length < 3) return; // Start search after 3 characters

    if (!validateAddressInput(inputValue)) {
      console.warn(`Invalid input address: ${inputValue}`);
      return;
    }

    setIsLoading(false);

    // Simulate API search request
    const response = await fetch(
      `${apiSearchEndpoint}?q=${encodeURIComponent(inputValue)}`
    );
    const data = await response.json();
    if (!data || !data.results) {
      console.warn(`No search results for: ${inputValue}`);
      return;
    }

    setSearchResultList(data.results);
    setIsLoading(false);
  };

  const debouncedHandleInputSearchChange = useCallback(
    debounce(handleInputSearchChange, 500),
    []
  );

  const handleOnSelectOption = (
    option: { label: string; value: string } | null
  ) => {
    // setSelectedOption(option);
    if (!option?.value) {
      // dispatch(
      //   updateUserInfo({
      //     addressZone: "",
      //     street: "",
      //     houseNumber: "",
      //     city: "",
      //     zip: "",
      //   })
      // );
      return;
    }
    const selectedAddrData = searchResultList.find(
      (addr) => addr.formatted === option.value
    );
    if (!selectedAddrData) {
      console.warn(`No address data found for: ${option.value}`);
      return;
    }
    // dispatch(
    //   updateUserInfo({
    //     addressZone: selectedAddrData.zone,
    //     street:
    //       selectedAddrData.addressComponents?.route ||
    //       selectedAddrData.formatted,
    //     houseNumber: selectedAddrData.addressComponents?.street_number || "",
    //     city: selectedAddrData.addressComponents?.locality || "",
    //     zip: selectedAddrData.addressComponents?.postal_code || "",
    //   })
    // );

    setInputSearch(selectedAddrData.formatted);
    onSelect(selectedAddrData);
  };

  useEffect(() => {
    setOptionsList(
      searchResultList?.map((addr: AddressLookupResultItem) => ({
        label: addr.formatted,
        value: addr.formatted,
      }))
    );
  }, [searchResultList]);

  useEffect(() => {
    if (selectedAddress?.formatted) {
      let _optionsList: { label: string; value: string }[] = optionsList;
      if (!optionsList?.length) _optionsList = [];

      _optionsList = [
        {
          label: selectedAddress.formatted,
          value: selectedAddress.formatted,
        },
        ..._optionsList,
      ];

      setOptionsList(_optionsList);
    }
  }, [selectedAddress]);

  return (
    <>
      <Select
        // className="w-full text-gray-700 bg-white border rounded-full focus:outline-none focus:border-secondary"
        // className="basic-single"
        // classNamePrefix="select"
        // classNames={{
        //   control: (state) => "text-primary",
        //   container: () =>
        //     "w-full text-gray-700 bg-white border rounded-full focus:outline-none",
        // }}
        styles={{
          control: (provided, state) => ({
            ...provided,
            border: "none",
            boxShadow: "none",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            width: "100%",
            background: "white",
            color: "black",
            cursor: "pointer",
            "&:hover": {
              borderColor: "none",
            },
          }),
        }}
        value={selectedOption}
        inputValue={inputSearch}
        name="addressSearch"
        onInputChange={debouncedHandleInputSearchChange}
        onChange={(option: any) => handleOnSelectOption(option)}
        options={optionsList}
        isLoading={isLoading}
        isClearable={true}
        placeholder={t("common.searchAddressPlaceholder")}
        noOptionsMessage={() =>
          t(
            !inputSearch || validateAddressInput(inputSearch)
              ? "common.noSearchResults"
              : "common.invalidAddress"
          )
        }
      />
    </>
  );
}

const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;

function validateAddressInput(address: string) {
  return addressRegex.test(address);
}

interface DebounceFunction {
  (...args: any[]): void;
}

const debounce = (
  func: (...args: any[]) => void,
  delay: number
): DebounceFunction => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
