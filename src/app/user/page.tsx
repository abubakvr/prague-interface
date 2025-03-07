"use client";

import { getUserProfile } from "@/hooks/useOrders";
import { UserProfile } from "@/types/user";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
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
    return <div>Loading user profile...</div>;
  }

  return (
    <div className=" max-w-4xl mx-auto">
      <div className="flex space-x-2 items-center mb-3">
        <Link href="/orders" className="px-4 py-2 bg-slate-200 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="w-6 h-6 text-black hover:cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-semibold">User Profile</h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="flex items-center mb-6 pb-4 border-b">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.nickName}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.isOnline
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {profile.isOnline ? "Online" : "Offline"}
              </span>
              <span className="text-sm text-gray-500">User ID: {userId}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Orders" value={profile.totalFinishCount} />
          <StatsCard title="Buy Orders" value={profile.totalFinishBuyCount} />
          <StatsCard title="Sell Orders" value={profile.totalFinishSellCount} />
          <StatsCard title="Completion Rate" value={profile.recentRate} />
          <StatsCard title="Positive Rating" value={profile.goodAppraiseRate} />
          <StatsCard
            title="Account Age"
            value={`${profile.accountCreateDays} days`}
          />
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoSection title="User Information">
            <InfoRow label="KYC Level" value={profile.kycLevel} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Mobile" value={profile.mobile} />
            <InfoRow label="Real Name" value={profile.realName} />
            <InfoRow label="Country" value={profile.kycCountryCode} />
            <InfoRow label="VIP Level" value={profile?.vipLevel?.toString()} />
          </InfoSection>

          <InfoSection title="Trading Statistics">
            <InfoRow
              label="Recent Trade Amount"
              value={profile.recentTradeAmount}
            />
            <InfoRow
              label="Total Trade Amount"
              value={profile.totalTradeAmount}
            />
            <InfoRow
              label="Avg. Release Time"
              value={`${profile.averageReleaseTime} min`}
            />
            <InfoRow
              label="Avg. Transfer Time"
              value={`${profile.averageTransferTime} min`}
            />
            <InfoRow
              label="Positive Reviews"
              value={profile?.goodAppraiseCount?.toString()}
            />
            <InfoRow
              label="Negative Reviews"
              value={profile?.badAppraiseCount?.toString()}
            />
          </InfoSection>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
