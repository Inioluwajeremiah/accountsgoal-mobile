import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Platform,
} from "react-native";
import React, { useMemo, useState } from "react";
import CustomTextInputField from "../../components/CustomTextInputField";
import CloseButton from "../../Icons/CloseButton";
import CustomTextRegular from "../../components/CustomTextRegular";
import CloseButtonBigIcon from "../../Icons/CloseButtonBigIcon";
import { status_bar_height, windowHeight } from "../../utils/Dimensions";
import MapPreviewAccountModal from "./dashboardComponents/MapPreviewAccountModal";

const SearchMap = ({
  closeSearchModal,
  handleOnPressMarker,
  excelData,
  searchTermInput,
  showSearch,
  showPreviewAccount,
  handelToggleAccountPreview,
  handleToggleTakeActionModal,
  currentItem,
  loadingUploadExcelFile,
  handleToggleContactModal,
  uniqueId,
  showTakeActionModal,
  showContactModal,
}) => {
  const [searchTerm, setSearchTerm] = useState(
    searchTermInput ? searchTermInput : ""
  );

  const searchData = useMemo(() => {
    // filter users
    let newExcelData = [];
    excelData &&
      excelData.forEach((user) => {
        user.data.forEach((data) => newExcelData.push(data));
      });

    // filter users
    const filteredClientData =
      newExcelData &&
      newExcelData.filter((user) =>
        user.ACCOUNT_NAME.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );

    return filteredClientData;
  }, [excelData, searchTerm]);

  const handleCloseButton = () => {
    closeSearchModal();
    handelToggleAccountPreview();
  };

  return (
    <Modal
      transparent={true}
      visible={showSearch}
      animationType="none"
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      <View className="absolute right-0 flex-1 h-full w-full bg-white  ">
        <View
          className="h-12 border border-form-text-color flex flex-row items-center justify-between rounded-3xl mb-4 px-6 mx-5 "
          style={{
            marginTop: Platform.OS === "ios" ? status_bar_height + 45 : 20,
          }}
        >
          <CustomTextInputField
            placeholder="Search account name"
            placeholderTextColor={"#B9B9B9"}
            cursorColor={"#B9B9B9"}
            onChangeText={(e) => setSearchTerm(e)}
            value={searchTerm}
            className="w-[70%]  py-3"
            //   onSubmitEditing={handleSubmitSearchTerm}
          />

          <TouchableOpacity
            className="w-6 h-6 flex items-center justify-center  "
            onPress={handleCloseButton}
          >
            <CloseButtonBigIcon />
          </TouchableOpacity>
        </View>
        <FlatList
          data={searchTerm ? searchData : []}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleOnPressMarker(item)}>
              <CustomTextRegular className="text-sm mt-4">
                {" "}
                {item.ACCOUNT_NAME}
              </CustomTextRegular>
            </TouchableOpacity>
          )}
          className=" flex-1 px-5"
          // ListHeaderComponent={() => <SearchBoxHeader />}
        />
      </View>
      {showPreviewAccount && (
        <MapPreviewAccountModal
          showPreviewAccount={showPreviewAccount}
          handelToggleAccountPreview={handelToggleAccountPreview}
          handleToggleTakeActionModal={handleToggleTakeActionModal}
          currentItem={currentItem}
          loadingUploadExcelFile={loadingUploadExcelFile}
          handleToggleContactModal={handleToggleContactModal}
          uniqueId={currentItem?.uniqueId}
          showTakeActionModal={showTakeActionModal}
          showContactModal={showContactModal}
        />
      )}
    </Modal>
  );
};

export default SearchMap;
