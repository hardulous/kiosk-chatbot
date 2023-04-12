import React, { createContext, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BotMessage from "../Component/Bot/BotMessage";
import UserMessage from "../Component/Bot/UserMessage";
import ShipOption from "../Component/Options/ShipOption";
import ShipList from "../Component/Options/ShipList";
import SysOption from "../Component/Options/SysOption";
import SysList from "../Component/Options/SysList";
import MmdOption from "../Component/Options/MmdOption";
import MmdList from "../Component/Options/MmdList";
import SubmitForm from "../Component/Options/SubmitForm";
import { unstable_batchedUpdates } from "react-dom";
import AllOptions from "../Component/Options/AllOptions";
import Error from "../Component/Options/Error";
const { ipcRenderer } = window;

export const kioskContext = createContext();

export const KioskProvider = ({ children }) => {
  // State for Starting of jar file and execution
  const [connection, setConnection] = useState(false);
  const [start, setStart] = useState(false);
  const [isBackup, setisBackup] = useState(true);

  // State for handling form detail with the help of chat bot
  const [cinNo, setCinNo] = useState("");
  const [userId, setUserId] = useState("");
  const [Ship, setShip] = useState("");
  const [shipList, setShipList] = useState([]);
  const [sysDetail, setSysDetail] = useState("");
  const [sysList, setsysList] = useState([]);
  const [mmd, setMmd] = useState("");
  const [mmdList, setMmdList] = useState([]);
  const [svPassword, setSvPassword] = useState("");

  // State for allowing selecting list by input
  const [inputShip, setinputShip] = useState(false);
  const [inputSys, setinputSys] = useState(false);
  const [inputMmd, setinputMmd] = useState(false);

  // State to allow adding new
  const [newShip, setnewShip] = useState(false);
  const [newSys, setnewSys] = useState(false);
  const [newMmd, setnewMmd] = useState(false);

  // State to show error in chat bot
  const [error, seterror] = useState(false);

  let uuid1 = uuidv4();
  let uuid2 = uuidv4();

  // State for keeping track of message state of bot
  const [messages, setmessages] = useState([]);
  const [msg, setmsg] = useState(null);

  useEffect(() => {
    const initilMessage = [
      {
        uuid: uuid1,
        isBot: true,
        component: (
          <BotMessage
            key={uuid1}
            uuid={uuid1}
            message={
              isBackup
                ? "Welcome To Kiosk For Restoration"
                : "Welcome To Kiosk For Extraction"
            }
          />
        ),
      },
      {
        uuid: uuid2,
        isBot: true,
        component: (
          <BotMessage
            key={uuid2}
            uuid={uuid2}
            message="Please Enter The Sanitization Certification Number"
          />
        ),
      },
    ];
    setmessages(initilMessage);
  }, [isBackup]);

  useEffect(() => {
    if (cinNo && userId && svPassword && Ship && sysDetail && mmd) {
      if (isBackup) {
        ipcRenderer.send(
          "start-backup-sh",
          cinNo,
          userId,
          svPassword,
          Ship,
          sysDetail,
          mmd
        );
      } else {
        ipcRenderer.send(
          "start-extract-sh",
          cinNo,
          userId,
          svPassword,
          Ship,
          sysDetail,
          mmd
        );
      }
    }
  }, [cinNo, userId, svPassword, Ship, sysDetail, mmd]);

  useEffect(() => {
    if (msg) {
      setmessages([...messages, msg]);
    }
  }, [msg]);

  useEffect(() => {
    if (error) {
      botResponse("show-error");
    }
  }, [error]);

  useEffect(() => {
    if (!connection && start) {
      startJar();
    }
    if (connection && !start) {
      ipcRenderer.send("kill-jar");
    }
  }, [start]);

  const startJar = () => {
    ipcRenderer.send("start-jar");
    ipcRenderer.on("connection", (event, res) => {
      setConnection(res);
    });
  };

  // Function to add messages in chat bot
  const handleMessages = (type, response, listType, custom) => {
    let userMessage;
    let uuid = uuidv4();

    if (type === "user" && !cinNo && !userId) {
      handleSend(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Certification Number: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setCinNo(response);
      setTimeout(() => {
        botResponse("handle-userid", response);
      }, [100]);
    } else if (type === "user" && cinNo && !userId) {
      handleSend(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`UserId: ${response}`} />
        ),
      };
      setmsg(userMessage);
      setUserId(response);
    } else if (type === "bot" && !shipList.length && listType === "shipList") {
      setShipList(response);
      botResponse("handle-ship", response);
    } else if (type === "user" && !response && custom === "Select Ship") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`Selected Option: 1`} />
        ),
      };
      setmsg(userMessage);
      setinputShip(true);
      setTimeout(() => {
        botResponse("show-ships", response);
      }, [500]);
    } else if (type === "user" && response && custom == "ship-selected") {
      setShip(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected Ship: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setinputShip(false);
      handleSend("b");
      handleSend(response);
    } else if (type === "user" && !response && custom === "New Ship") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`Selected Option: 2`} />
        ),
      };
      setnewShip(true);
      setmsg(userMessage);
      setTimeout(() => {
        botResponse("create-ship", response);
      }, [500]);
    } else if (type === "user" && newShip) {
      handleSend("a");
      handleSend(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`New Ship: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setnewShip(false);
    } else if (type === "bot" && !sysList.length && listType === "sysList") {
      setsysList(response);
      botResponse("handle-sys", response);
    } else if (type === "user" && !response && custom === "Select Sys") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`Selected Option: 1`} />
        ),
      };
      setmsg(userMessage);
      setinputSys(true);
      setTimeout(() => {
        botResponse("show-sys-list", response);
      }, [500]);
    } else if (type === "user" && response && custom == "sys-selected") {
      setSysDetail(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected System: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setinputSys(false);
      handleSend("e");
      handleSend(response);
    } else if (type === "user" && !response && custom === "New Sys") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`Selected Option: 2`} />
        ),
      };
      setnewSys(true);
      setmsg(userMessage);
      setTimeout(() => {
        botResponse("create-sys", response);
      }, [500]);
    } else if (type === "user" && newSys) {
      handleSend("d");
      handleSend(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`New System: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setnewSys(false);
    } else if (type === "bot" && !mmdList.length && listType === "mmdList") {
      setMmdList(response);
      botResponse("handle-mmd", response);
    } else if (type === "user" && !response && custom === "Select Mmd") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`Selected Option: 1`} />
        ),
      };
      setmsg(userMessage);
      setinputMmd(true);
      setTimeout(() => {
        botResponse("show-mmd-list", response);
      }, [500]);
    } else if (type === "user" && response && custom == "mmd-selected") {
      setMmd(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected Mmd: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setinputMmd(false);
      handleSend("h");
      // handleSend(response);  in case of mmd no need to send selected mmd to jar file
      setTimeout(() => {
        botResponse("done-form", response);
      }, [500]);
    } else if (type === "user" && !response && custom === "New Mmd") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`Selected Option: 2`} />
        ),
      };
      setnewMmd(true);
      setmsg(userMessage);
      setTimeout(() => {
        botResponse("create-mmd", response);
      }, [500]);
    } else if (type === "user" && newMmd) {
      handleSend("g");
      handleSend(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`New Mmd: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setnewMmd(false);
    }

    // Allow user to select list by input tag
    else if (
      type === "user" &&
      response &&
      shipList.length &&
      inputShip &&
      custom === "input-ship"
    ) {
      setShip(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected Ship: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setinputShip(false);
      handleSend("b");
      handleSend(response);
    } else if (
      type === "user" &&
      response &&
      sysList.length &&
      inputSys &&
      custom === "input-sys"
    ) {
      setSysDetail(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected System: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setinputSys(false);
      handleSend("e");
      handleSend(response);
    } else if (
      type === "user" &&
      response &&
      mmdList.length &&
      inputMmd &&
      custom === "input-mmd"
    ) {
      setMmd(response);
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected Mmd: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setinputMmd(false);
      handleSend("h");
      handleSend(response);
      setTimeout(() => {
        botResponse("done-form", response);
      }, [500]);
    }

    // If user want to again fill the form
    else if (custom === "redo") {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage
            key={uuid}
            uuid={uuid}
            message={`Selected Option: ${response}`}
          />
        ),
      };
      setmsg(userMessage);
      setTimeout(() => {
        botResponse("all-option", response);
      }, [500]);
    }

    // Show user about invalid option
    else {
      userMessage = {
        uuid,
        isUser: true,
        component: (
          <UserMessage key={uuid} uuid={uuid} message={`${response}`} />
        ),
      };
      setmsg(userMessage);
      setTimeout(() => {
        valid();
      }, 500);
    }
  };

  // Function to handle cases of component to be shown by bot
  const botResponse = (res) => {
    let botMessage;
    let uuid = uuidv4();
    if (res === "handle-userid") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Please Enter The User Id"
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "handle-ship") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Please Take Action Regarding Ship"
            option={<ShipOption />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "show-ships") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Select The Ship"
            option={<ShipList />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "create-ship") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Add Ship Name To Be Added"
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "handle-sys") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Please Take Action Regarding System"
            option={<SysOption />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "show-sys-list") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Select The System"
            option={<SysList />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "create-sys") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Add System Name To Be Added"
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "handle-mmd") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message={
              isBackup
                ? "Please Take Action Regarding Backup File"
                : "Please Take Action Regarding Mmd"
            }
            option={<MmdOption />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "show-mmd-list") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message={isBackup ? "Select The Backup File" : "Select The Mmd"}
            option={<MmdList />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "create-mmd") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Add Mmd Name To Be Added"
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "done-form") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="All Configuration Are Done. Go To Next Step ?"
            option={<SubmitForm />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "all-option") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            message="Want To Change Or Update Any Configuration"
            option={<AllOptions />}
          />
        ),
      };
      setmsg(botMessage);
    } else if (res === "show-error") {
      botMessage = {
        uuid,
        isBot: true,
        component: (
          <BotMessage
            key={uuid}
            uuid={uuid}
            hReload={true}
            message="Csv Files Are Not Configured Correctly"
            option={<Error />}
          />
        ),
      };
      setmsg(botMessage);
    }
  };

  // Function to send user message to jar file
  const handleSend = (res) => {
    ipcRenderer.send("to-kiosk-back", res);
  };

  // Function to prompt user to add valid option
  const valid = () => {
    let preMsg = messages[messages.length - 1];
    let botMessage;
    let uuid = uuidv4();
    botMessage = {
      uuid,
      isBot: true,
      component: (
        <BotMessage
          key={uuid}
          uuid={uuid}
          valid={true}
          message={preMsg.component.props.message}
          option={preMsg.component.props.option}
        />
      ),
    };
    setmsg(botMessage);
  };

  // Function to reset everything on submit of form
  const handleReset = () => {
    const initilMessage = [
      {
        uuid: uuid1,
        isBot: true,
        component: (
          <BotMessage
            key={uuid1}
            uuid={uuid1}
            message={
              isBackup
                ? "Welcome To Kiosk For Restoration"
                : "Welcome To Kiosk For Extraction"
            }
          />
        ),
      },
      {
        uuid: uuid2,
        isBot: true,
        component: (
          <BotMessage
            key={uuid2}
            uuid={uuid2}
            message="Please Enter Your Certification Number And UserId"
          />
        ),
      },
    ];
    setConnection(false);
    setStart(false);
    seterror(false);
    setCinNo("");
    setUserId("");
    setShip("");
    setShipList([]);
    setSysDetail("");
    setsysList([]);
    setMmd("");
    setMmdList([]);
    setSvPassword("");
    setnewShip(false);
    setnewSys(false);
    setnewMmd(false);
    setmessages(initilMessage);
    setmsg("");
  };

  // Function to perfrom hard reload
  const hardReload = () => {
    const initilMessage = [
      {
        uuid: uuid1,
        isBot: true,
        component: (
          <BotMessage
            key={uuid1}
            uuid={uuid1}
            message={
              isBackup
                ? "Welcome To Kiosk For Restoration"
                : "Welcome To Kiosk For Extraction"
            }
          />
        ),
      },
      {
        uuid: uuid2,
        isBot: true,
        component: (
          <BotMessage
            key={uuid2}
            uuid={uuid2}
            message="Please Enter Your Certification Number And UserId"
          />
        ),
      },
    ];
    ipcRenderer.send("kill-jar");
    setConnection(false);
    seterror(false);
    setCinNo("");
    setUserId("");
    setShip("");
    setShipList([]);
    setSysDetail("");
    setsysList([]);
    setMmd("");
    setMmdList([]);
    setSvPassword("");
    setnewShip(false);
    setnewSys(false);
    setnewMmd(false);
    setmessages(initilMessage);
    setmsg("");
    startJar();
  };

  console.log({
    messages,
  });

  return (
    <kioskContext.Provider
      value={{
        connection,
        setConnection,
        start,
        setStart,
        isBackup,
        setisBackup,
        messages,
        handleMessages,
        botResponse,
        cinNo,
        setCinNo,
        userId,
        setUserId,
        Ship,
        setShip,
        shipList,
        setShipList,
        sysDetail,
        setSysDetail,
        sysList,
        setsysList,
        mmd,
        setMmd,
        mmdList,
        setMmdList,
        svPassword,
        setSvPassword,
        newShip,
        newSys,
        newMmd,
        handleSend,
        handleReset,
        inputShip,
        inputSys,
        inputMmd,
        error,
        seterror,
        hardReload,
      }}
    >
      {children}
    </kioskContext.Provider>
  );
};
