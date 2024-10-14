"use client";
import { CommonHeader } from "@/components/Header/CommonHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RequiredAuthLayout } from "@/layout/AuthLayout";
import { MainLayout } from "@/layout/MainLayout";
import {
  getUserTicket,
  postVerifyUserTicket,
} from "@/redux/slices/ticketSlice";
import { UserTicket } from "@/types/user_ticket";
import { useEffect, useRef, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";

export default function ScanTicketPage() {
  const dispatch = useAppDispatch();
  const [user_ticket, setUserTicket] = useState<UserTicket | null>(null);
  const isLoading = useAppSelector((state) => state.ticket.loading);
  const [camera, setCamera] = useState("environment"); // Default to rear camera
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    // Get all video input devices (cameras)
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
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
  }, []);
  
  const requestCameraPermission = async (deviceId:string) => {
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
      setUserTicket(null);
    } else {
      dialogRef.current.showModal();
    }
  }

  const handleResultScan = (result: string) => {
    if (user_ticket == null && !isLoading) {
      dispatch(getUserTicket(result)).then((value) => {
        if (value != null) {
          toggleDialog();
        }
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(postVerifyUserTicket(user_ticket?.public_id ?? "")).then(
      (value) => {
        if (value != null) {
          toggleDialog();
        }
      }
    );
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
            <h1 className="text-xl text-black">Scan kehadiran peserta event</h1>
            {!error && videoDevices.length > 0 && (
        <div>
          <p>Select a camera to grant access:</p>
          {videoDevices.map((device, index) => (
            <button key={device.deviceId} onClick={() => requestCameraPermission(device.deviceId)}>
              {device.label || `Camera ${index + 1}`}
            </button>
          ))}
        </div>
      )}
            {!hasPermission ? (
              <div>
                
              </div>
            ) : (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                <button onClick={toggleCamera}>
                  Switch to {camera === "environment" ? "Front" : "Rear"} Camera
                </button>
                {/* QR Reader Component */}
                <QrReader
                  scanDelay={300}
                  containerStyle={{ width: "100%", height: "500px" }}
                  videoStyle={{ width: "100%", height: "100%" }}
                  onResult={(result, error) => {
                    if (!!result) {
                      handleResultScan(result.getText());
                    }
                    if (!!error) {
                      toast.error(error.message, {
                        className: "toast",
                      });
                    }
                  }}
                  constraints={{ facingMode: camera }}
                />

                {/* Focus Rectangle (Overlay) */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "200px", // Adjust size as needed
                    height: "200px", // Adjust size as needed
                    border: "3px solid red", // Color of the focus rectangle
                    transform: "translate(-50%, -50%)", // Center it in the middle of the container
                    zIndex: 2, // Make sure it appears above the QR Reader
                    pointerEvents: "none", // Allow clicks to pass through the rectangle
                  }}
                />
              </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <dialog
              ref={dialogRef}
              id="confirm"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box bg-[#F3F3F3] dark:bg-boxdark shadow-bottom-right border-2 border-black">
                <div className="flex flex-row py-2">
                  <p className="min-w-[80px] text-lg text-black dark:text-white">
                    Nama
                  </p>
                  <p className="font-bold text-lg text-black dark:text-white">
                    {user_ticket?.user?.name}
                  </p>
                </div>
                <div className="flex flex-row py-2">
                  <p className="min-w-[80px] text-lg text-black dark:text-white">
                    Event
                  </p>
                  <p className="font-bold text-lg text-black dark:text-white">
                    {user_ticket?.event?.title}
                  </p>
                </div>
                <div className="flex flex-row py-2">
                  <p className="min-w-[80px] text-lg text-black dark:text-white">
                    Jenis Tiket
                  </p>
                  <p className="font-bold text-lg text-black dark:text-white">
                    {user_ticket?.ticket?.name}
                  </p>
                </div>
                <div className="modal-action">
                  <form
                    method="dialog"
                    onSubmit={handleSubmit}
                    onReset={toggleDialog}
                  >
                    {/* if there is a button in form, it will close the modal */}
                    <button
                      type="submit"
                      className="btn mr-4 bg-success hover:bg-success hover:bg-opacity-80 shadow-bottom-right text-white"
                    >
                      Verifikasi
                    </button>
                    <button
                      type="reset"
                      className="btn bg-danger hover:bg-opacity-80 hover:bg-danger shadow-bottom-right text-white"
                    >
                      Tutup
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
