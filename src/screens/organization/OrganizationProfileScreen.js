import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeactivateOrganizationMutation,
  useGetAnOrganizationQuery,
  useLeaveOrganizationMutation,
  useRemindUserMutation,
  useRemoveUserFromOrganizationMutation,
  useUpdateOrganizationMutation,
} from "../../slices/organizationApiSlice";
import { useUpdatePasswordMutation } from "../../slices/usersApiSlice";
import DropDownAlert from "../../components/DropDownAlert";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { status_bar_height } from "../../utils/Dimensions";
import { clearAcgUserData } from "../../slices/userSlice";

const OrganizationProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [logout, setLogout] = useState(false);
  const {
    data: accountsGoalOrganisation,
    isLoading: loadingGetOrganisation,
    isError: isGetOrganisationError,
    error: getOrganisationError,
  } = useGetAnOrganizationQuery({ userId: accountsGoalUser?._id });

  const [
    deactivateOrganization,
    { isLoading: loadingDeactivate, error: deactivateError },
  ] = useDeactivateOrganizationMutation();

  const [
    leaveOrganization,
    {
      isLoading: loadingleaveOrganization,
      error: leaveOrganizationError,
      isError: isleaveOrganizationError,
      isSuccess: isLeaveOrganisationSuccess,
      success: leaveOrganizationSucess,
    },
  ] = useLeaveOrganizationMutation();

  const [
    remindUser,
    {
      isLoading: loadingRemindUser,
      error: remindUserError,
      isError: isRemindUserError,
      isSuccess: isRemindUserSuccess,
      success: remindUserSucess,
    },
  ] = useRemindUserMutation();

  const [
    removeUserFromOrganization,
    {
      isLoading: loadingRemoveUser,
      error: removeUserError,
      isError: isRemoveUserError,
      isSuccess: isRemoveUserSuccess,
      success: removeUserSucess,
    },
  ] = useRemoveUserFromOrganizationMutation();

  const isAdmin = !accountsGoalUser?.invitedUserId;

  // accountsGoalOrganisation?.organization[0]?.userId === accountsGoalUser._id
  //     ? true
  //     : false;

  // const isAdmin = false;

  const handleSaveChanges = () => {};

  const handleDeactivateOrganisation = async () => {
    const response = await deactivateOrganization({
      userId: accountsGoalOrganisation?.organization[0]?._id,
    });
  };

  const handleLeaveOrganisation = async (email) => {
    Alert.alert(
      "",
      `Are you sure you want to leave ${accountsGoalOrganisation?.organization[0]?.companyName}?`,
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "YES",
          onPress: async () => {
            const response = await leaveOrganization({ userEmail: email });
            if (response?.data) {
              setShowAlertModal(true);
              setAlertMessage(response?.data?.message);
              setAlertType("success");
              setLogout(true);
            }
            if (response?.error) {
              setShowAlertModal(true);
              setAlertMessage(
                response?.error?.data?.error ||
                  "An error occured while leaving organization"
              );
              setAlertType("danger");
              // Alert.alert("", "An error occured while leaving organization")
            }
          },
        },
      ]
    );
  };
  const handleRemindUser = async (email) => {
    Alert.alert("", `Send reminder to ${email}`, [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const response = await remindUser({
            organizationId: accountsGoalOrganisation?.organization[0]?._id,
            userId: accountsGoalUser?._id,
            userEmail: email,
          });
          if (response?.data?.data) {
            setShowAlertModal(true);
            setAlertMessage(response?.data?.message);
            setAlertType("success");
          } else {
            setShowAlertModal(true);
            setAlertMessage("Unable to send reminder");
            setAlertType("danger");
          }
        },
      },
    ]);
  };
  const handleRemoveUser = async (email) => {
    Alert.alert(
      "",
      `Remove ${email} from ${accountsGoalOrganisation?.organization[0]?.companyName}`,
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const response = await removeUserFromOrganization({
              userId: accountsGoalOrganisation?.organization[0]?._id,
              userEmail: email,
            });
            if (response?.data?.data === "SUCCESS") {
              setShowAlertModal(true);
              setAlertMessage(response?.data?.data.message);
              setAlertType("success");
            }
            if (response?.error) {
              setShowAlertModal(true);
              setAlertMessage(response?.error?.data?.error);
              setAlertType("danger");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        if (logout === true) {
          setShowAlertModal(false);
          dispatch(clearAcgUserData());
          navigation.navigate("login");
        }
      }, 2000);
    }
  });
  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      <ScrollView
        className="px-5 flex flex-col"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      >
        <View>
          {/* header */}
          <View className="mt-4 flex flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon />
            </TouchableOpacity>
            <CustomTextRegular className="text-base font-bold ml-3">
              Organisation Profile
            </CustomTextRegular>
          </View>

          {isAdmin && (
            <View className="flex flex-row items-center self-end mt-8">
              {/* edit profile */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "editOrganization",
                    accountsGoalOrganisation
                  )
                }
              >
                <CustomTextRegular className="text-xs text-[#A8A8A8]">
                  Edit profile
                </CustomTextRegular>
              </TouchableOpacity>
              <TouchableOpacity>
                {/* generate link */}
                {/* <CustomTextRegular className="text-primary-color text-xs ml-4">
                  Generate link
                </CustomTextRegular> */}
              </TouchableOpacity>
            </View>
          )}

          {/* view 1 */}
          <View>
            <CustomTextRegular className="text-base font-bold text-black  mt-12">
              {accountsGoalOrganisation?.organization &&
                accountsGoalOrganisation?.organization[0]?.companyName}
            </CustomTextRegular>
            <CustomTextRegular className="text-xs text-[#5C5C5C] mt-2">
              Organisation name
            </CustomTextRegular>
            <CustomTextRegular className="text-base font-bold text-black mt-10 ">
              {accountsGoalOrganisation?.organization &&
                accountsGoalOrganisation?.organization[0]?.companySize}
            </CustomTextRegular>
            <CustomTextRegular className="text-xs text-[#5C5C5C] mt-2">
              Company Size
            </CustomTextRegular>
            <CustomTextRegular className="text-base font-bold text-black mt-10">
              {accountsGoalOrganisation?.organization &&
                accountsGoalOrganisation?.organization[0]?.companyType}
            </CustomTextRegular>
            <CustomTextRegular className="text-xs text-[#5C5C5C] mt-2">
              Company Type
            </CustomTextRegular>
          </View>
          {/* view 2 */}
          <View>
            <CustomTextRegular className="text-base font-bold mt-16 mb-6">
              Organisation members
            </CustomTextRegular>
            {accountsGoalOrganisation?.organization &&
              accountsGoalOrganisation?.organization[0]?.invitedUsers?.map(
                (item, index) => {
                  // if (item?.email === accountsGoalUser?.email || isAdmin) {
                  const isOwner = item?.email === accountsGoalUser?.email;
                  return (
                    <View
                      key={index}
                      className="w-full flex flex-row items-center mb-4 flex-wrap gap-2 "
                    >
                      <CustomTextRegular className=" w-[5%] text-primary-accent-color text-sm">
                        {index + 1}.
                      </CustomTextRegular>
                      <View className=" w-[70%] flex flex-row items-center  flex-wrap gap-2 ">
                        <CustomTextRegular className="text-primary-accent-color text-xs">
                          {item.email}
                        </CustomTextRegular>
                        <View
                          className={`px-2 py-1 rounded-2xl ${item.status === "Pending" ? "bg-primary-accent-color" : item.status === "Accepted" ? "bg-[#89CB69]" : item.status === "Admin" ? "bg-[#FFA500]" : ""}`}
                        >
                          <CustomTextRegular className="text-[10px] text-white">
                            {item.status}
                          </CustomTextRegular>
                        </View>
                      </View>

                      {/* perform action on members */}
                      <TouchableOpacity
                        className="ml-4 w-[15%] flex items-end"
                        onPress={
                          // () => handleRemoveUser(item.email)
                          item.status === "Accepted" && !isAdmin && isOwner
                            ? () => handleLeaveOrganisation(item.email)
                            : item.status === "Accepted" && isAdmin
                              ? () => handleRemoveUser(item.email)
                              : item.status === "Pending" && isAdmin
                                ? () => handleRemindUser(item.email)
                                : null
                        }
                      >
                        {/* {loadingRemindUser ||
                    loadingRemoveUser ||
                    loadingleaveOrganization ? (
                      <ActivityIndicator
                        size={"small"}
                        color={
                          item.status === "Accepted"
                            ? "#F13535"
                            : item.status === "Pending"
                              ? "#777777"
                              : ""
                        }
                      />
                    ) : ( */}
                        <CustomTextRegular
                          className={`text-xs ${
                            item.status === "Accepted" && !isAdmin && isOwner
                              ? "text-[#F13535]"
                              : item.status === "Accepted" && isAdmin
                                ? "text-[#F13535] "
                                : item.status === "Pending" && isAdmin
                                  ? "text-primary-accent-color "
                                  : ""
                          } `}
                        >
                          {item.status === "Accepted" && !isAdmin && isOwner
                            ? "Leave"
                            : item.status === "Accepted" && isAdmin
                              ? "Remove "
                              : item.status === "Pending" && isAdmin
                                ? "Remind "
                                : ""}
                        </CustomTextRegular>
                        {/* )} */}
                      </TouchableOpacity>
                    </View>
                  );
                  // }
                }
              )}
          </View>
        </View>
        {/* deactivate organisation button*/}

        {isAdmin && (
          <TouchableOpacity
            className={`
          bg-tomato-red rounded-full mt-16 h-12 py-3 flx justify-center items-center mb-10`}
            onPress={handleDeactivateOrganisation}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              Deactivate organization
            </CustomTextRegular>
          </TouchableOpacity>
        )}
      </ScrollView>

      {(loadingDeactivate ||
        loadingRemindUser ||
        loadingRemoveUser ||
        loadingleaveOrganization) && (
        <LottieLoadingScreen
          loading={
            loadingDeactivate ||
            loadingRemindUser ||
            loadingRemoveUser ||
            loadingleaveOrganization
          }
        />
      )}
      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={alertMessage}
          type={alertType}
        />
      )}
    </SafeAreaView>
  );
};

export default OrganizationProfileScreen;
