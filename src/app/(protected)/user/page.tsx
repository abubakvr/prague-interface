"use client";

import { getUserProfile } from "@/hooks/useOrders";
import type { UserProfile } from "@/types/user";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineGlobe,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineClock,
  HiOutlineThumbUp,
  HiOutlineThumbDown,
  HiOutlineBadgeCheck,
  HiOutlineStatusOnline,
} from "react-icons/hi";
import { useTheme } from "@/context/ThemeContext";

function UserProfileContent() {
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const orderId = searchParams.get("orderId");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      if (userId && orderId) {
        setLoading(true);
        try {
          const userProfile = await getUserProfile(orderId, userId);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Handle error appropriately, maybe set an error state
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserProfile();
  }, [userId, orderId]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-3"></div>
          <div className="text-blue-600 font-medium">
            Loading user profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <div
        className={`flex items-center mb-8 p-4 rounded-2xl shadow-sm transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "bg-gradient-to-r from-slate-700 to-slate-600"
            : "bg-gradient-to-r from-blue-50 to-blue-100"
        }`}
      >
        <Link
          href="/orders"
          className="p-2 bg-white rounded-full hover:bg-blue-200 transition-all duration-300 shadow-sm hover:shadow-md mr-4"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-blue-700" />
        </Link>
        <h1
          className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
          }`}
        >
          User Profile
        </h1>
        <div className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-200">
          ID: {userId}
        </div>
      </div>

      <div
        className={`rounded-2xl shadow-xl border overflow-hidden transform transition-all duration-300 hover:shadow-2xl mb-8 ${
          resolvedTheme === "dark"
            ? "bg-slate-800 border-slate-600"
            : "bg-white border-blue-100"
        }`}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-full shadow-lg mr-4">
              <HiOutlineUser className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {profile.nickName}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    profile.isOnline
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <HiOutlineStatusOnline className="w-4 h-4 mr-1" />
                  {profile.isOnline ? "Online" : "Offline"}
                </span>
                <span className="text-sm text-blue-100 flex items-center">
                  <HiOutlineBadgeCheck className="w-4 h-4 mr-1" />
                  KYC Level: {profile.kycLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
          <StatsCard
            icon={<HiOutlineShoppingCart className="w-5 h-5 text-blue-600" />}
            title="Total Orders"
            value={profile.totalFinishCount}
          />
          <StatsCard
            icon={<HiOutlineCurrencyDollar className="w-5 h-5 text-blue-600" />}
            title="Buy Orders"
            value={profile.totalFinishBuyCount}
          />
          <StatsCard
            icon={<HiOutlineCurrencyDollar className="w-5 h-5 text-blue-600" />}
            title="Sell Orders"
            value={profile.totalFinishSellCount}
          />
          <StatsCard
            icon={<HiOutlineThumbUp className="w-5 h-5 text-blue-600" />}
            title="Completion Rate"
            value={profile.recentRate}
          />
          <StatsCard
            icon={<HiOutlineThumbUp className="w-5 h-5 text-blue-600" />}
            title="Positive Rating"
            value={profile.goodAppraiseRate}
          />
          <StatsCard
            icon={<HiOutlineClock className="w-5 h-5 text-blue-600" />}
            title="Account Age"
            value={`${profile.accountCreateDays} days`}
          />
        </div>

        {/* Detailed Information */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "bg-slate-700" : "bg-blue-50"
          }`}
        >
          <InfoSection
            icon={<HiOutlineUser className="w-6 h-6 text-blue-600" />}
            title="User Information"
          >
            <InfoRow
              icon={<HiOutlineBadgeCheck className="w-5 h-5 text-blue-500" />}
              label="KYC Level"
              value={profile.kycLevel}
            />
            <InfoRow
              icon={<HiOutlineMail className="w-5 h-5 text-blue-500" />}
              label="Email"
              value={profile.email}
            />
            <InfoRow
              icon={<HiOutlinePhone className="w-5 h-5 text-blue-500" />}
              label="Mobile"
              value={profile.mobile}
            />
            <InfoRow
              icon={
                <HiOutlineIdentification className="w-5 h-5 text-blue-500" />
              }
              label="Real Name"
              value={profile.realName}
            />
            <InfoRow
              icon={<HiOutlineGlobe className="w-5 h-5 text-blue-500" />}
              label="Country"
              value={profile.kycCountryCode}
            />
            <InfoRow
              icon={<HiOutlineBadgeCheck className="w-5 h-5 text-blue-500" />}
              label="VIP Level"
              value={profile?.vipLevel?.toString()}
            />
          </InfoSection>

          <InfoSection
            icon={<HiOutlineShoppingCart className="w-6 h-6 text-blue-600" />}
            title="Trading Statistics"
          >
            <InfoRow
              icon={
                <HiOutlineCurrencyDollar className="w-5 h-5 text-blue-500" />
              }
              label="Recent Trade Amount"
              value={profile.recentTradeAmount}
            />
            <InfoRow
              icon={
                <HiOutlineCurrencyDollar className="w-5 h-5 text-blue-500" />
              }
              label="Total Trade Amount"
              value={profile.totalTradeAmount}
            />
            <InfoRow
              icon={<HiOutlineClock className="w-5 h-5 text-blue-500" />}
              label="Avg. Release Time"
              value={`${profile.averageReleaseTime} min`}
            />
            <InfoRow
              icon={<HiOutlineClock className="w-5 h-5 text-blue-500" />}
              label="Avg. Transfer Time"
              value={`${profile.averageTransferTime} min`}
            />
            <InfoRow
              icon={<HiOutlineThumbUp className="w-5 h-5 text-blue-500" />}
              label="Positive Reviews"
              value={profile?.goodAppraiseCount?.toString()}
            />
            <InfoRow
              icon={<HiOutlineThumbDown className="w-5 h-5 text-blue-500" />}
              label="Negative Reviews"
              value={profile?.badAppraiseCount?.toString()}
            />
          </InfoSection>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-3"></div>
            <div className="text-blue-600 font-medium">Loading...</div>
          </div>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}

function StatsCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 ${
        resolvedTheme === "dark"
          ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
          : "bg-blue-50 border-blue-100 hover:bg-blue-100"
      }`}
    >
      <div className="flex items-center mb-2">
        {icon}
        <div
          className={`text-sm font-medium ml-2 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-300" : "text-blue-700"
          }`}
        >
          {title}
        </div>
      </div>
      <div
        className={`text-xl font-semibold transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-slate-100" : "text-blue-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function InfoSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      className={`p-5 rounded-xl shadow-md border transition-colors duration-200 ${
        resolvedTheme === "dark"
          ? "bg-slate-800 border-slate-600"
          : "bg-white border-blue-100"
      }`}
    >
      <div
        className={`flex items-center mb-4 pb-2 border-b transition-colors duration-200 ${
          resolvedTheme === "dark" ? "border-slate-600" : "border-blue-100"
        }`}
      >
        {icon}
        <h3
          className={`font-semibold ml-2 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-blue-300" : "text-blue-800"
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span
          className={`ml-2 transition-colors duration-200 ${
            resolvedTheme === "dark" ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`font-medium transition-colors duration-200 ${
          resolvedTheme === "dark" ? "text-blue-300" : "text-blue-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
