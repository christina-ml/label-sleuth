/*
    Copyright (c) 2022 IBM Corp.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { MainElement } from "./Element";
import { useAppSelector } from "../../../customHooks/useRedux";
import "../../../components/pagination/pagination.css";
import classes from "./MainPanel.module.css";
import left_icon from "../../../assets/workspace/doc_left.svg";
import right_icon from "../../../assets/workspace/doc_right.svg";
import Tooltip from "@mui/material/Tooltip";
import {
  PREV_DOC_TOOLTIP_MSG,
  NEXT_DOC_TOOLTIP_MSG,
  LEFT_DRAWER_WIDTH,
  ACTIONS_DRAWER_WIDTH,
  APPBAR_HEIGHT,
  PanelIdsEnum,
} from "../../../const";
import { getPanelDOMKey } from "../../../utils/utils";
import { useScrollMainPanelElementIntoView } from "../../../customHooks/useScrollElementIntoView";
import { CustomPagination } from "../../../components/pagination/CustomPagination";
import { useFetchPrevNextDoc } from "../../../customHooks/useFetchPrevNextDoc";
import { useMainPagination } from "../../../customHooks/useMainPagination";
import { Element } from "../../../global";
import { currentDocNameSelector } from "../redux/documentSlice";

const Main = styled(Box, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, rightDrawerWidth }: { theme?: any; open: boolean; rightDrawerWidth: number }) => ({
    position: "fixed",
    padding: theme.spacing(3),
    margin: 0,
    right: ACTIONS_DRAWER_WIDTH,
    left: LEFT_DRAWER_WIDTH,
    top: APPBAR_HEIGHT,
    bottom: 0,
    overflow: "none",
    ...(open && {
      marginRight: rightDrawerWidth,
    }),
  })
);

interface MainPanelProps {
  open: boolean;
  rightDrawerWidth: number;
}

const MainPanel = ({ open, rightDrawerWidth }: MainPanelProps) => {
  const documents = useAppSelector((state) => state.workspace.documents);
  const mainPanelElementsPerPage = useAppSelector((state) => state.featureFlags.mainPanelElementsPerPage);
  const curDocIndex = useAppSelector((state) => state.workspace.curDocIndex);
  const curDocName = useAppSelector(currentDocNameSelector);

  const { currentContentData, hitCount, currentPage, onPageChange, isPaginationRequired } =
    useMainPagination(mainPanelElementsPerPage);

  const { handleFetchNextDoc, handleFetchPrevDoc } = useFetchPrevNextDoc();

  useScrollMainPanelElementIntoView();

  return (
    <>
      <Main
        className={`${classes.main_content} ${isPaginationRequired ? classes.pagination_margin : ""}`}
        open={open}
        rightDrawerWidth={rightDrawerWidth}
      >
        <div className={classes.doc_header}>
          <Tooltip
            title={curDocIndex !== 0 ? PREV_DOC_TOOLTIP_MSG : ""}
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: curDocIndex !== 0 ? "common.black" : "transparent",
                },
              },
            }}
          >
            <button
              className={curDocIndex === 0 ? classes["doc_button_disabled"] : classes["doc_button"]}
              onClick={handleFetchPrevDoc}
            >
              <img src={left_icon} alt={"previous document"} />
            </button>
          </Tooltip>
          <div className={classes.doc_stats}>
            <h6>{curDocName}</h6>
            <em>Text Entries: {hitCount ?? 0}</em>
          </div>
          <Tooltip
            title={documents.length - 1 !== curDocIndex ? NEXT_DOC_TOOLTIP_MSG : ""}
            placement="left"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: documents.length - 1 !== curDocIndex ? "common.black" : "transparent",
                },
              },
            }}
          >
            <button
              className={documents.length - 1 === curDocIndex ? classes["doc_button_disabled"] : classes["doc_button"]}
              onClick={handleFetchNextDoc}
            >
              <img src={right_icon} alt={"next document"} />
            </button>
          </Tooltip>
        </div>
        <div className={classes.doc_content}>
          <Box id="main-element-view">
            {currentContentData &&
              currentContentData.map((element) => (
                <MainElement
                  element={element as Element}
                  key={getPanelDOMKey((element as Element).id, PanelIdsEnum.MAIN_PANEL)}
                />
              ))}
          </Box>
        </div>
        <CustomPagination
          hitCount={hitCount}
          sidebarPanelElementsPerPage={mainPanelElementsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
          size="medium"
          sx={{ bottom: "-50px" }}
          isPaginationRequired={isPaginationRequired}
        />
      </Main>
    </>
  );
};

export default MainPanel;
