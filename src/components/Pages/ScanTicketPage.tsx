"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";
import { postPresenceTicket } from "@/redux/slices/ticketSlice";
import { ResScanTicket } from "@/types/presence";
import { PresenceTicket } from "@/types/ticket";
import { useEffect, useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "react-toastify";
import { CSSProperties } from "react";
import { formatStrToDateTime } from "@/utils/convert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import QRCode from "qrcode.react";

export default function ScanTicketPage({
  params,
}: {
  params: { slug: string };
}) {
  const dispatch = useAppDispatch();
  const [presence, setPresence] = useState<ResScanTicket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [camera, setCamera] = useState("environment"); // Default to rear camera
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    // Get all video input devices (cameras)
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(videoInputDevices);

        if (videoInputDevices.length === 0) {
          setError("No camera devices found.");
        }
      } catch (err) {
        console.error("Error enumerating devices: ", err);
        setError("Error fetching camera devices.");
      }
    };

    getDevices();
    toggleDialog();
  }, []);

  const requestCameraPermission = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream to free up resources
    } catch (err) {
      console.log(err);
      setError("Camera access denied. Please enable the camera.");
    }
  };

  const toggleCamera = () => {
    setCamera((prevCamera) =>
      prevCamera === "environment" ? "user" : "environment"
    );
  };

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
      setPresence(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  const handleResultScan = (result: string) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (presence == null) {
      const data = {
        slug: params.slug,
        public_id: result,
      } as PresenceTicket;
      dispatch(postPresenceTicket(data)).then((value) => {
        if (value.payload != null) {
          setPresence(value.payload);
          toggleDialog();
        }
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      <RequiredAuthLayout>
        <MainLayout>
          <CommonHeader
            title="Scan QR-Code"
            isShowBack={true}
            isShowTrailing={false}
          />
          <div className="max-w-layout xs:w-full h-full w-screen bg-yellow-400 p-4">
            <h1 className="text-4xl text-black font-bold mb-5">
              Scan kehadiran peserta event
            </h1>
            {!hasPermission ? (
              <div className="w-full max-w-150 relative"></div>
            ) : (
              <Scanner
                scanDelay={1500}
                allowMultiple={true}
                onScan={(result) => {
                  if (
                    result.length > 0 &&
                    isLoading == false &&
                    presence == null
                  ) {
                    handleResultScan(result[0].rawValue);
                  }
                }}
                onError={(error) => {
                  console.log(error);
                }}
                styles={{
                  container: { width: "100%", height: "100%", maxHeight:"400px" },
                  video: videoStyle,
                }}

                constraints={{ facingMode: camera }}
              />
            )}
            {isLoading ? (
              <div className="mt-10 mx-auto h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            ) : (
              hasPermission && (
                <button
                  onClick={toggleCamera}
                  className="w-full mt-5 btn bg-black text-white"
                >
                  Switch to {camera === "environment" ? "Front" : "Rear"} Camera
                </button>
              )
            )}

            {!error && videoDevices.length > 0 && !hasPermission && (
              <div>
                {videoDevices.map((device, index) => (
                  <button
                    key={device.deviceId}
                    onClick={() => requestCameraPermission(device.deviceId)}
                    className="mt-5 w-full btn bg-black text-white"
                  >
                    {device.label || `Request Camera Permission`}
                  </button>
                ))}
              </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <dialog
              ref={dialogRef}
              id="confirm"
              className="modal modal-bottom max-w-layout mx-auto h-full"
            >
              <div className="modal-box bg-yellow-400 min-h-full p-5">
                <div className="flex flex-col w-full bg-yellow-300 justify-center items-center rounded-xl px-5 py-10">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="5x"
                    style={{ color: "green" }}
                  />
                  <h1 className="font-bold text-black text-2xl my-5">
                    Scan QR Berhasil
                  </h1>
                  <div className="w-full bg-yellow-200 rounded-lg p-4">
                    <div className="flex flex-row items-center">
                      <div className="flex flex-col mr-3 items-center">
                        <QRCode
                          value={presence?.user_ticket?.public_id ?? ""}
                          size={100}
                          bgColor="#FCE969"
                        />
                        <h1 className="text-black">
                          {presence?.user_ticket?.public_id}
                        </h1>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-col">
                          <p className="min-w-[80px] text-md text-black dark:text-white">
                            Nama
                          </p>
                          <p className="font-bold text-md text-black dark:text-white">
                            {presence?.user_ticket?.user_name}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="min-w-[80px] text-md text-black dark:text-white">
                            Email
                          </p>
                          <p className="font-bold text-md text-black dark:text-white">
                            {presence?.user_ticket?.user_email}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="min-w-[80px] text-md text-black dark:text-white">
                            Jenis Tiket
                          </p>
                          <p className="font-bold text-md text-black dark:text-white">
                            {presence?.user_ticket?.ticket?.name ?? ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <details className="collapse collapse-arrow p-0" open={true}>
                    <summary className="collapse-title text-lg font-medium text-black">
                      Riwayat Check-in
                    </summary>
                    <div className="collapse-content px-5">
                      {presence?.presences?.map((e, i) => (
                        <div key={i} className="w-full flex flex-row justify-between">
                          <p className="font-medium text-sm text-black ">
                            Scan ke {i + 1}{" "}
                          </p>
                          <p className="font-medium text-sm text-black ">
                            {formatStrToDateTime(
                              e,
                              "dd-MM-yyyy (HH:mm:ss)",
                              true
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                  <form
                    method="dialog"
                    onReset={toggleDialog}
                    className="w-full"
                  >
                    <button
                      type="reset"
                      className="mt-10 w-full btn bg-primary hover:bg-opacity-80 hover:bg-primary shadow-bottom-right text-white text-lg"
                    >
                      Scan Lainnya
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </MainLayout>
      </RequiredAuthLayout>
    </>
  );
}

const videoStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: "500px",
  margin: "0 auto",
  height: "500px",
};

const focusAreaStyle: CSSProperties = {
  position: "absolute", // Correctly typed position property
  top: "50%",
  left: "50%",
  width: "250px", // Transparent focus area dimensions
  height: "250px",
  transform: "translate(-50%, -50%)", // Centering the focus area
  border: "2px solid #fff", // White border around the focus area
  boxSizing: "border-box", // Ensure border is included in size
  background: "transparent",
};
