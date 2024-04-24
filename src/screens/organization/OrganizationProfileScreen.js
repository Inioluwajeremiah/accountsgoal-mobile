import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import { useSelector } from "react-redux";
import { useUpdateOrganizationMutation } from "../../slices/organizationApiSlice";
import { useUpdatePasswordMutation } from "../../slices/usersApiSlice";

const OrganizationProfileScreen = ({ navigation }) => {
  const { accountsGoalUser, accountsGoalOrganisation } = useSelector(
    (state) => state.acgUser
  );

  console.log(
    "accountsGoalOrganisation at profile ==> ",
    accountsGoalOrganisation
  );
  console.log("accountsGoalusr ==> ", accountsGoalUser);

  const handleUpdateOrganization = () => {};
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5 flex flex-col"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        {/* header */}
        <View className="mt-8 flex flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon />
          </TouchableOpacity>
          <CustomTextRegular className="text-base font-bold ml-3">
            Organisation Profile
          </CustomTextRegular>
        </View>

        <View className="flex flex-row items-center self-end mt-8">
          <TouchableOpacity
            onPress={() => navigation.navigate("editOrganization")}
          >
            <CustomTextRegular className="text-xs text-[#A8A8A8] border-r border-r-[#A8A8A8] pr-4">
              Edit profile
            </CustomTextRegular>
          </TouchableOpacity>
          <TouchableOpacity>
            <CustomTextRegular className="text-primary-color text-xs ml-4">
              Generate link
            </CustomTextRegular>
          </TouchableOpacity>
        </View>

        {/* view 1 */}
        <View>
          <CustomTextRegular className="text-base font-bold text-black  mt-12">
            {accountsGoalOrganisation.companyName}
          </CustomTextRegular>
          <CustomTextRegular className="text-xs text-[#5C5C5C] mt-2">
            Organisation name
          </CustomTextRegular>
          <CustomTextRegular className="text-base font-bold text-black mt-10 ">
            {accountsGoalOrganisation.companySize}
          </CustomTextRegular>
          <CustomTextRegular className="text-xs text-[#5C5C5C] mt-2">
            Company Size
          </CustomTextRegular>
          <CustomTextRegular className="text-base font-bold text-black mt-10">
            {accountsGoalOrganisation.companyType}
          </CustomTextRegular>
          <CustomTextRegular className="text-xs text-[#5C5C5C] mt-2">
            Company Type
          </CustomTextRegular>
        </View>
        {/* view 2 */}
        <View>
          <CustomTextRegular className="text-base font-bold mt-16 mb-4">
            Organisation members
          </CustomTextRegular>
        </View>
        {/* next button */}
        <TouchableOpacity
          className={`
           
          bg-tomato-red rounded-full mt-16 h-12 py-3 flx justify-center items-center mb-10`}
          onPress={null}
        >
          <CustomTextRegular className="text-center font-semibold text-white text-base">
            Deactivate organization
          </CustomTextRegular>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrganizationProfileScreen;
