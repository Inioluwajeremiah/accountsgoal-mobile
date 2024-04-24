import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import LabelComponent from "../../components/LabelComponent";
import CustomTextInputField from "../../components/CustomTextInputField";
import {
  useCreateOrganizationAndSkipInviteMutationMutation,
  useCreateOrganizationMutation,
} from "../../slices/organizationApiSlice";
import { setAcgOrganisationData, setAcgUserData } from "../../slices/userSlice";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { useDispatch, useSelector } from "react-redux";

const InviteOthersScreen = ({ navigation, route }) => {
  const { accountsGoalOrganisation, accountsGoalUser } = useSelector(
    (state) => state.acgUser
  );
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

  console.log("members  ===> ", members);
  console.log("acg user data   ===> ", accountsGoalOrganisation);

  const handleAddMembersButton = () => {
    addMembers((preVItem) => [...preVItem, {}]);
  };

  const handleAddMembers = (item, index) => {
    addMembers((prevMembers) => {
      prevMembers[index] = item;
      // prevMembers[index] = "pending";
      return [...prevMembers];
    });
  };

  // const handleAddMembers = (item, index) => {
  //   addMembers((prevMembers) => {
  //     prevMembers[index]["title"] = item;
  //     prevMembers[index]["status"] = "pending";
  //     return [...prevMembers];
  //   });
  // };

  const handleSendInvite = async () => {
    try {
      const body = organizatioParams
        ? {
            ...organizatioParams,
            members: members,
            token: accountsGoalUser.token,
          }
        : {
            companyName: accountsGoalOrganisation.companyName,
            companyType: accountsGoalOrganisation.companyType,
            companySize: accountsGoalOrganisation.companySize,
            members: members,
            token: accountsGoalUser.token,
          };

      const response = await createOrganization(body);
      console.log("send organization invite response ===> ", response);
      if (response.error) {
        Alert.alert("", response.error.data.msg);
      }
      if (response.data.data) {
        dispatch(setAcgOrganisationData(response.data.organisation));
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
  const handleCreateOrganization = async () => {
    try {
      const body = {
        ...organizatioParams,
        members: [],
        token: accountsGoalUser.token,
      };
      const response = await createOrganizationAndSkipInviteMutation(body);
      console.log(
        "create organization response at skip invite ===> ",
        response
      );
      if (response.error) {
        Alert.alert("", response.error.data.msg);
      }
      if (response?.data.organization) {
        dispatch(setAcgOrganisationData(response.data.organization));
        navigation.navigate("createOrganizationSuccessAlert");
      }
    } catch (error) {
      console.log("catch error ===> ", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
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
              <CustomTextInputField
                key={index}
                placeholder="example@useremail.com"
                value={item.title}
                cursorColor={"#B9B9B9"}
                placeholderTextColor={"#B9B9B9"}
                className={` w-full h-12 text-black 
                border border-border-color 
                rounded-3xl px-6 py-3 mt-4 text-sm `}
                onChangeText={(e) => handleAddMembers(e, index)}
              />
            ))}
            {/* <Pressable
                          onPress={() => handleSelectMemberss(item.email)}
                          className={`${
                            index === filteredClientData.length - 1
                              ? "border-none"
                              : "border-b-[0.7px] border-b-form-text-color"
                          }`}
                          key={index}
                        >
                          <CustomTextRegular
                            className={` py-3 ${
                              attachedClients.includes(item.email)
                                ? "text-black"
                                : "text-form-text-color"
                            }`}
                          >
                            {item.email}
                          </CustomTextRegular>
                        </Pressable> */}
            {/* generate link and add members */}
            <View className="flex flex-row justify-between mt-10">
              {/* generate link */}
              <TouchableOpacity>
                <CustomTextRegular className="text-xs text-primary-color">
                  Generate link
                </CustomTextRegular>
              </TouchableOpacity>
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
                {/* {[...accountsGoalOrganisation.members, accountsGoalUser.email].map(
            (item, index) => (
              <View key={index} className="flex flex-row items-center mt-4">
                <CustomTextRegular className="text-left text-sm text-secondary-accent-color mr-6">
                  {index + 1}
                </CustomTextRegular>
                <TouchableOpacity className="  flex-1 flex flex-row items-center justify-start">
                  <CustomTextRegular className="text-left text-sm text-secondary-accent-color">
                    {item === accountsGoalUser.email ? "You" : item}
                  </CustomTextRegular>
                  <CustomTextRegular
                    className={`${
                      item.status === "admin"
                        ? "bg-orange"
                        : item.status === "pending"
                          ? "bg-[#A8A8A8]"
                          : item.status === "accepted"
                            ? "bg-[#89CB69]"
                            : ""
                    } text-white rounded-2xl text-[10px] font-semibold px-2 py-1 flex text-center justify-center  ml-3`}
                  >
               
                  </CustomTextRegular>
                </TouchableOpacity>

                <TouchableOpacity>
                  <CustomTextRegular
                    className={`text-xs ${
                      item.status === "pending"
                        ? "text-[#A8A8A8]"
                        : item.status === "accepted"
                          ? "text-[#F13535]"
                          : ""
                    } `}
                  >
                    {item.status === "accepted"
                      ? "Leave"
                      : item.status === "pending"
                        ? "Remind"
                        : ""}
                  </CustomTextRegular>
                </TouchableOpacity>
              </View>
            )
          )} */}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="pb-10">
          {/* send invitation button */}
          <TouchableOpacity
            className={` bg-primary-color
           rounded-full mt-16 h-12 py-3 flex justify-center items-center mb-10`}
            onPress={handleSendInvite}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              {laodingCreateOrganization ? (
                <ActivityIndicator size="small" color={"#fff"} />
              ) : (
                "Send Invitation"
              )}
              {/* Send Invitation */}
            </CustomTextRegular>
          </TouchableOpacity>

          {/* skip button */}
          <TouchableOpacity
            // className="flex justify-center items-center"
            onPress={handleCreateOrganization}
          >
            <CustomTextRegular className="text-center text-xs text-[#777777]">
              {laodingSkipInvite ? (
                <ActivityIndicator size="small" color={"#4169E1"} />
              ) : (
                "Skip >>>"
              )}
            </CustomTextRegular>
          </TouchableOpacity>
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
