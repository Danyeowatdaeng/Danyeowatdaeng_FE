import PrimaryButton from "./PrimaryButton";
import Icon from "../atoms/Icon";

interface ReservationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationInfoModal({ isOpen, onClose }: ReservationInfoModalProps) {
  if (!isOpen) return null;

  const reservationPlaces = [
    "냐옹냐옹고양이까페",
    "광주애견호텔유치원", 
    "24시 애견미용"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">예약하기 안내</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon src="/Assets/icons/Close.svg" />
          </button>
        </div>

        {/* 내용 */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-4">
            예약하기 기능은 제휴를 가정하고 진행하였기 때문에,<br />
            지정된 장소에서 예약하기 기능들이 작동합니다.
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">제휴 장소:</p>
            <ul className="space-y-1">
              {reservationPlaces.map((place, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 확인 버튼 */}
        <PrimaryButton
          variant="primary"
          size="md"
          onClick={onClose}
        >
          확인
        </PrimaryButton>
      </div>
    </div>
  );
}
