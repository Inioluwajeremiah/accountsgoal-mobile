import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import LabelComponent from "../../components/LabelComponent";
import CustomTextInputField from "../../components/CustomTextInputField";
import {
  useAddMemberMutation,
  useCreateOrganizationAndSkipInviteMutationMutation,
  useCreateOrganizationMutation,
  useGetAnOrganizationQuery,
} from "../../slices/organizationApiSlice";
import { setAcgOrganisationData, setAcgUserData } from "../../slices/userSlice";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { status_bar_height } from "../../utils/Dimensions";
import CloseButton from "../../Icons/CloseButton";

const InviteOthersScreen = ({ navigation, route }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const dispatch = useDispatch();
  const organizatioParams = route.params;
  const [companyName, setCompanyName] = useState("");
  const [members, addMembers] = useState([{}]);

  const [
    createOrganization,
    { isLoading: laodingCreateOrganization, error: errorCreatingOrganization },
  ] = useCreateOrganizationMutation();
  const [
    createOrganizationAndSkipInviteMutation,
    { isLoading: laodingSkipInvite, error: errorSkippingInvite },
  ] = useCreateOrganizationAndSkipInviteMutationMutation();

  const {
    data: accountsGoalOrganisation,
    isLoading: loadingGetOrganisation,
    isError: isGetOrganisationError,
    error: getOrganisationError,
  } = useGetAnOrganizationQuery({ userId: accountsGoalUser._id });

  const [
    addMember,
    {
      isLoading: loadingAddMember,
      error: addMemberError,
      isError: isAddMemberError,
      isSuccess: isAdmemberSuccess,
      success: addMemberSucess,
    },
  ] = useAddMemberMutation();

  const handleAddMembersButton = () => {
    addMembers((preVItem) => [...preVItem, {}]);
  };

  const handleAddMembers = (item, index) => {
    addMembers((prevMembers) => {
      prevMembers[index] = item;
      return [...prevMembers];
    });
  };

  const handleRemoveMember = (index) => {
    addMembers((prevMembers) => {
      return prevMembers.filter((prevMember, i) => i !== index);
    });
  };

  const handleSendInvite = async () => {
    try {
      const body = organizatioParams
        ? {
            user: accountsGoalUser?._id,
            ...organizatioParams,
            members: members,
            token: accountsGoalUser?.token,
          }
        : {
            user: accountsGoalUser._id,
            companyName: accountsGoalOrganisation?.organization[0]?.companyName,
            companyType: accountsGoalOrganisation?.organization[0]?.companyType,
            companySize: accountsGoalOrganisation?.organization[0]?.companySize,
            members: members,
            token: accountsGoalUser?.token,
          };

      const response = await createOrganization(body);
      if (response.error) {
        Alert.alert("", response.error.data.msg);
      }
      if (response.data.data) {
        // dispatch(setAcgOrganisationData(response.data.organisation));
        navigation.navigate("inviteSuccessAlert");
      }

      if (errorSkippingInvite) {
        Alert.alert("", errorSkippingInvite.data.msg);
      }

      // if (response.error) {
      //   Alert.alert("", response.error.data.msg);
      // }
    } catch (error) {
      console.log("catch error ===> ", error);
    }
  };

  // handle skip button
  const handleSkipInvite = async () => {
    try {
      const body = {
        user: accountsGoalUser._id,
        ...organizatioParams,
        members: [],
        token: accountsGoalUser.token,
      };
      const response = await createOrganizationAndSkipInviteMutation(body);
      if (response.error) {
        Alert.alert("", response.error.data.msg);
      }
      if (response?.data) {
        // dispatch(setAcgOrganisationData(response.data.organization));
        navigation.navigate("createOrganizationSuccessAlert");
      }
    } catch (error) {
      console.log("catch error ===> ", error);
    }
  };

  // send invite to new members
  const handleAddNewMembers = async () => {
    // const new_members = members.map((item, index) => item.email);
    const response = await addMember({
      userId: accountsGoalUser._id,
      members: members,
      organizationId: accountsGoalOrganisation?.organization[0]?._id,
    });

    if (response.data?._id) {
      Alert.alert("", "Your invitation has been sent successfully");
    }

    if (response.error?.data) {
      Alert.alert("", response?.error?.data?.msg);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      {/* back icon */}

      <ScrollView
        className="flex-1 px-5 "
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className=" flex-1">
          <TouchableOpacity
            className="mt-5 -ml-2"
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>
          {/* header */}
          <CustomTextRegular className="text-2xl font-bold text-center mt-8 ">
            Invite others
          </CustomTextRegular>
          <CustomTextRegular className="text-sm leading-7 mt-6 text-[#5C5C5C] text-center px-5 mb-6">
            {
              "Use email or generate a unique link to easily bring new members onboard and collaborate effectively."
            }
          </CustomTextRegular>

          <View className="relative">
            <LabelComponent label={"Add members"} required={false} />
            {members.map((item, index) => (
              <View className="w-full flex-row items-center justify-between border border-border-color rounded-full mt-4 px-5">
                <CustomTextInputField
                  key={index}
                  placeholder="example@useremail.com"
                  value={item.title}
                  cursorColor={"#B9B9B9"}
                  placeholderTextColor={"#B9B9B9"}
                  className={`w-[80%] h-12 text-black   py-3  text-sm `}
                  onChangeText={(e) => handleAddMembers(e, index)}
                />
                <TouchableOpacity
                  className=" w-8 h-8 flex items-center justify-center p-2"
                  onPress={() => handleRemoveMember(index)}
                >
                  <View className="w-6 h-6 rounded-full flex items-center justify-center border border-[#A8A8A8]">
                    <CloseButton color={"#A8A8A8"} />
                  </View>
                </TouchableOpacity>
              </View>
            ))}

            {/* generate link and add members */}
            <View className="flex flex-row justify-end mt-10">
              {/* generate link */}
              {/* <TouchableOpacity>
                <CustomTextRegular className="text-xs text-primary-color">
                  Generate link
                </CustomTextRegular>
              </TouchableOpacity> */}
              {/* add members */}
              <TouchableOpacity
                className="flex flex-row items-center"
                onPress={handleAddMembersButton}
              >
                <View className="h-4 w-4 rounded-full border border-[#FFA500]">
                  <CustomTextRegular className="text-[10px] font-bold text-[#FFA500] text-center">
                    +
                  </CustomTextRegular>
                </View>
                <CustomTextRegular className="text-sm font-medium text-[#FFA500] ml-2">
                  Add more members
                </CustomTextRegular>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="pb-10">
          {/* send invitation button */}
          <TouchableOpacity
            className={` bg-primary-color
           rounded-full mt-16 h-12 py-3 flex justify-center items-center mb-10`}
            onPress={organizatioParams ? handleSendInvite : handleAddNewMembers}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              {laodingCreateOrganization || loadingAddMember ? (
                <ActivityIndicator size="small" color={"#fff"} />
              ) : (
                "Send Invitation"
              )}
              {/* Send Invitation */}
            </CustomTextRegular>
          </TouchableOpacity>

          {/* skip button */}
          {organizatioParams && (
            <TouchableOpacity
              // className="flex justify-center items-center"
              onPress={handleSkipInvite}
            >
              <CustomTextRegular className="text-center text-xs text-[#777777]">
                {laodingSkipInvite ? (
                  <ActivityIndicator size="small" color={"#4169E1"} />
                ) : (
                  "Skip >>>"
                )}
              </CustomTextRegular>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {laodingCreateOrganization && (
        <LottieLoadingScreen loading={laodingCreateOrganization} />
      )}
      {/* {errorCreatingOrganization &&
        Alert.alert("", errorCreatingOrganization.data.msg)} */}

      {(laodingSkipInvite || laodingSkipInvite) && (
        <LottieLoadingScreen loading={laodingSkipInvite || laodingSkipInvite} />
      )}
      {/* {errorSkippingInvite && Alert.alert("", errorSkippingInvite.data.msg)} */}
    </SafeAreaView>
  );
};

export default InviteOthersScreen;
