import React, { useEffect, useState, useRef } from "react";

import { v4 as uuidv4 } from "uuid";

import { getSchedule } from "@/services/scheduleService";
import { getPlayerStatsByTeams, getTeamStatsByTeams } from "@/services/statService";
import { getTeamList } from "@/services/teamService";
import { getTierList } from "@/services/tierService";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";

import defaultConfig from "@/data/config.json";

import ("@/style/controlPanel.scss");

const defaultTeamData = [
	{
		"color_primary": "206cff",
		"color_secondary": "",
		"name": "",
		"score": 0
	},
	{
		"color_primary": "f88521",
		"color_secondary": "",
		"name": "",
		"score": 0
	}
];

const defaultSeriesScore = [0, 0];
const currentSeason = 9;

let panelTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#ffffff",
			secondary: "#999999",
		},
	},
});

const Item = styled("div")(({ theme }) => ({
	background: "transparent",
	padding: theme.spacing(1),
	textAlign: "left",
	color: "#ffffff",
}));

const interviewNoTeam = {
	"name": "(none)",
	"shortName": "",
	"code": "SGL",
	"soccerTeamAbbreviation": "",
	"soccerTeamLocation": "",
	"soccerTeamName": "",
	"bgColor": "cccccc",
	"tier": "",
	"logo": "/images/logos/sgl-logo.png"
}

const ControlPanel = () => {

	const [clientId, setClientId] = useState("");
	const [config, setConfig] = useState(defaultConfig);
	const [customClientId, setCustomClientId] = useState("");
	const [currentDialog, setCurrentDialog] = useState(null);
	const [seriesScore, setSeriesScore] = useState(defaultSeriesScore);
	const [teamData, setTeamData] = useState(defaultTeamData);
	const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [viewState, setViewState] = useState("");

	const [teamList, setTeamList] = useState({});
	const [tierList, setTierList] = useState({});

	const [fieldsWithChanges, setFieldsWithChanges] = useState([]);

	const [brandLogoField, setBrandLogoField] = useState("");
	const [headerField, setHeaderField] = useState(""); // TODO: handle multiple headers?
	const [interviewSaved, setInterviewSaved] = useState({});
	const [interviewNameField, setInterviewNameField] = useState("");
	const [interviewTeamField, setInterviewTeamField] = useState(interviewNoTeam);
	const [matchdayNumberField, setMatchdayNumberField] = useState(1);
	const [roundField, setRoundField] = useState(""); // TODO: handle multiple headers?
	const [seasonNumberField, setSeasonNumberField] = useState(currentSeason);
	const [seriesLengthField, setSeriesLengthField] = useState(0);
	const [seriesScoreFields, setSeriesScoreFields] = useState(defaultSeriesScore);
	const [seriesTypeField, setSeriesTypeField] = useState("");
	const [showSeriesField, setShowSeriesField] = useState(false);
	const [soccerTeamFields, setSoccerTeamFields] = useState(["", ""]);
	const [streamTypeField, setStreamTypeField] = useState("SGL-regular"); // default to regular season if not already set
	const [teamFields, setTeamFields] = useState(["", ""]);
	const [teamLogoFields, setTeamLogoFields] = useState(["", ""]);
	const [teamNameFields, _setTeamNameFields] = useState(["", ""]);
	const [tierField, setTierField] = useState("");

	const thisUrl = new URL(document.location.href);
	const statsUrlPrefix = `${thisUrl.protocol}//${thisUrl.host}`;

	const teamNameFieldsRef = useRef(teamNameFields);
	const setTeamNameFields = (data) => {
		teamNameFieldsRef.current = data;
		_setTeamNameFields(data);
	}

 	useEffect(() => {

		// on start, check for existing items in localstorage; if not, send default

		if (localStorage.hasOwnProperty("clientId")) {
			setClientId(localStorage.getItem("clientId"));
		} else {
			generateRandomClientId();
		}

		if (localStorage.hasOwnProperty("config")) {
			setConfigValuesFromLocalStorage();
		} else {
			setConfigValuesToDefault();
		}

		if (localStorage.hasOwnProperty("interview")) {
			const interviewIn = JSON.parse(localStorage.getItem("interview"));
			setInterviewSaved(interviewIn);
			setInterviewNameField(interviewIn.name);
			// TODO: figure out why this is setting as blank
			setInterviewTeamField(interviewIn.team);
		} else {
			setInterviewNameField("");
			setInterviewTeamField(interviewNoTeam);
		}

		if (localStorage.hasOwnProperty("seriesScore")) {
			setSeriesScoreFromLocalStorage();
		} else {
			localStorage.setItem("seriesScore", JSON.stringify(seriesScore));
		}

		if (localStorage.hasOwnProperty("teamData")) {
			setTeamData(JSON.parse(localStorage.getItem("teamData")));
		} else {
			setConfig(defaultTeamData);
			localStorage.setItem("teamData", JSON.stringify(defaultTeamData));
		}

		if (localStorage.hasOwnProperty("viewstate")) {
			setViewState(localStorage.getItem("viewstate"));
		} else {
			setViewState("");
		}

		// listen for localstorage updates for game data and series score
		window.onstorage = (event) => {
			switch(event.key) {
				case "teamData":
					if(event.newValue !== null) {
						setTeamData(JSON.parse(event.newValue));
					}
					break;

				case "seriesScore":
					const seriesScoreIn = JSON.parse(localStorage.getItem("seriesScore"));
					setSeriesScore(seriesScoreIn);
					setSeriesScoreFields(seriesScoreIn);
					break;

				case "viewstate":
					if(event.newValue !== null) {
						setViewState(event.newValue);
					}
				break;

			}
		};
	}, []);

	// check for unsaved changes
	useEffect(() => {
		if (config.hasOwnProperty("teams")) {
			const tempFieldsWithChanges = [];
			for (let teamnum in config.teams) {
				if (teamNameFields[teamnum] !== config.teams[teamnum].name) {
					tempFieldsWithChanges.push(`teamNameField${teamnum}`);
				}
				if (soccerTeamFields[teamnum] !== config.teams[teamnum].soccerTeamName) {
					tempFieldsWithChanges.push(`soccerTeamField${teamnum}`);
				}
				if (teamLogoFields[teamnum] !== config.teams[teamnum].logo) {
					tempFieldsWithChanges.push(`teamLogoField${teamnum}`);
				}
				if (seriesScoreFields[teamnum] !== seriesScore[teamnum]) {
					tempFieldsWithChanges.push(`seriesScoreField${teamnum}`);
				}
				if (
					(teamFields[teamnum].hasOwnProperty("name") && teamFields[teamnum].name !== config.teams[teamnum].name)
					|| (!teamFields[teamnum].hasOwnProperty("name") && config.teams[teamnum].name)
				) {
					tempFieldsWithChanges.push(`teamField${teamnum}`);
				}
			}
			// TODO: handle multiple headers
			if (headerField !== config.general.headers[0]) {
				tempFieldsWithChanges.push("headerField");
			}
			if (roundField !== config.general.round) {
				tempFieldsWithChanges.push("roundField");
			}
			if (seriesTypeField !== config.series.type) {
				tempFieldsWithChanges.push("seriesTypeField");
			}
			if (seriesLengthField !== config.series.maxGames) {
				tempFieldsWithChanges.push("seriesLengthField");
			}
			if (showSeriesField !== config.series.show) {
				tempFieldsWithChanges.push("showSeriesField");
			}
			if (brandLogoField !== config.general.brandLogo) {
				tempFieldsWithChanges.push("brandLogoField");
			}
			if (tierField !== config.general.tier) {
				tempFieldsWithChanges.push("tierField");
			}
			if (streamTypeField !== config.general.streamType) {
				tempFieldsWithChanges.push("streamTypeField");
			}
			if (Number(seasonNumberField) !== Number(config.general.season)) {
				tempFieldsWithChanges.push("seasonNumberField");
			}
			if (Number(matchdayNumberField) !== Number(config.general.matchday)) {
				tempFieldsWithChanges.push("matchdayNumberField");
			}
			if (interviewNameField !== interviewSaved.name) {
				tempFieldsWithChanges.push("InterviewNameField");
			}
			if (interviewSaved.hasOwnProperty("team")) {
				if (interviewTeamField.code !== interviewSaved.team.code) {
					tempFieldsWithChanges.push("InterviewTeamField");
				}
			}
			// if (headerField !== config.general.headers[0]) {
			// 	tempFieldsWithChanges.push("headerField");
			// }

			setFieldsWithChanges(tempFieldsWithChanges);
		}

	}, [
		soccerTeamFields,
		headerField,
		interviewNameField,
		interviewTeamField,
		roundField,
		brandLogoField,
		matchdayNumberField,
		seasonNumberField,
		seriesLengthField,
		seriesScoreFields,
		seriesTypeField,
		showSeriesField,
		streamTypeField,
		teamFields,
		teamLogoFields,
		teamNameFields,
		tierField,
	]);

	useEffect(() => {
		openDialog("loading");
		Promise.all([
			loadTeamList(),
			loadTierList(),
			loadSchedule(),
		])
			.then(() => {
				setTeamFields(["", ""]);
				closeDialog();
			})
			.catch((error) => {
				closeDialog();
			});
		;
	}, []);

	const fieldHasChanges = (fieldName) => fieldsWithChanges.indexOf(fieldName) > -1;

	const openDialog = (dialog) => {
		setCurrentDialog(dialog);
	}

	const closeDialog = (event, reason) => {
		if (reason && reason === "backdropClick") {
			return;
		}
		setCurrentDialog(null);
		setCustomClientId("");
	}

	const saveCustomIdDialog = async () => {
		if (!customClientId) {
			openSnackbar("Client ID is required");
		} else {
			setClientId(customClientId);
			try {
				localStorage.setItem("clientId", customClientId);
				openSnackbar("New Client ID saved");
				closeDialog();
			} catch (err) {
				console.error(err.message);
				openSnackbar("Error saving Client ID");
			}
		}
	}

	const openSnackbar = (message) => {
		setSnackbarMessage(message);
		setSnackbarIsOpen(true);
	}

	const closeSnackbar = () => {
		setSnackbarMessage(null);
		setSnackbarIsOpen(false);
	}

	const saveClientId = async (newClientId) => {
		setClientId(newClientId);
		try {
			localStorage.setItem("clientId", newClientId);
		} catch (err) {
			console.error(err.message);
			openSnackbar("Error saving Client ID");
		}
	}

	const generateRandomClientId = async () => {
		await saveClientId(uuidv4());
		openSnackbar("New random Client ID saved");
	}

	const copyClientIdToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(clientId);
			openSnackbar("Client ID Copied");
		} catch (err) {
			console.error(err.message);
			openSnackbar("Error copying Client ID");
		}
	}

	// TODO: doesn't work in OBS currently; figure out how to fix?
	const copyStatsUrlToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(`${thisUrl.protocol}//${thisUrl.host}/stats/${clientId}`);
			openSnackbar("Stats page URL Copied");
		} catch (err) {
			console.error(err.message);
			openSnackbar("Error copying stats page URL");
		}
	}

	const loadTierList = async () => {

		if (!Array.isArray(tierList) || tierList.length < 1 ) {
			getTierList()
				.then((loadedTierList) => {
					setTierList(loadedTierList);
					setTeamFields(["", ""]);
					localStorage.setItem("tierList", JSON.stringify(loadedTierList));
				})
				.catch((error) => {
					closeDialog();
					console.error(error);
					openSnackbar("Error getting tier list from sheets");
				});

		}
	}

	const loadSchedule = async () => {

		getSchedule()
			.then((loadedSchedule) => {
				localStorage.setItem("matchSchedule", JSON.stringify(loadedSchedule));
			})
			.catch((error) => {
				console.error(error);
				openSnackbar("Error getting schedule from sheets");
			});

	}

	const loadScheduleManual = () => {
		openDialog("loading");
		loadSchedule()
			.finally(() => {
				closeDialog();
			});

	}

	const loadTeamList = async () => {

		if (!Array.isArray(teamList) || teamList.length < 1 ) {

			getTeamList()
				.then((loadedTeamList) => {
					setTeamList(loadedTeamList);

					// if a current team name matches, select the object
					const currentTeamFields = [...teamFields];
					const currentTeamNameFields = [...teamNameFieldsRef.current];
					const currentSoccerTeamFields = [...soccerTeamFields];
					localStorage.setItem("teamList", JSON.stringify(loadedTeamList));

					for (let teamNum in currentTeamNameFields) {
						const matchedTeam = loadedTeamList.filter((team) => team.name === currentTeamNameFields[teamNum]);

						if (matchedTeam.length === 1) {
							currentTeamFields[teamNum] = matchedTeam[0];
							currentTeamNameFields[teamNum] = matchedTeam[0].name;
							currentSoccerTeamFields[teamNum] = matchedTeam[0].soccerTeamName;
						} else {
							currentTeamFields[teamNum] = "";
							currentTeamNameFields[teamNum] = "";
							currentSoccerTeamFields[teamNum] = "";
						}

						setTeamFields(currentTeamFields);
						setTeamNameFields(currentTeamNameFields);
						setSoccerTeamFields(currentSoccerTeamFields);
					}

				})
				.catch((error) => {
					console.error(error);
					openSnackbar("Error getting team list from sheets");
				});
		}

	}

	const changeSeriesScoreField = (score, teamNumber) => {
		if (score === "" || Number.isInteger(Number(score))) {
			const tempSeriesScoreField = [... seriesScoreFields];
			tempSeriesScoreField[teamNumber] = score === "" ? "" : Number(score);
			setSeriesScoreFields(tempSeriesScoreField);
		}
	}

	const changeTeamNameField = (name, teamNumber) => {
		const tempTeamNameField = [... teamNameFields];
		tempTeamNameField[teamNumber]= name;
		setTeamNameFields(tempTeamNameField);
	}

	const changeSoccerTeamField = (name, teamNumber) => {
		const tempSoccerTeamField = [... soccerTeamFields];
		tempSoccerTeamField[teamNumber]= name;
		setSoccerTeamFields(tempSoccerTeamField);
	}

	const changeTeamLogoField = (logo, teamNumber) => {
		const tempTeamLogoField = [... teamLogoFields];
		tempTeamLogoField[teamNumber]= logo;
		setTeamLogoFields(tempTeamLogoField);
	}

	const changeShowSeriesField = (value) => {
		setShowSeriesField(value);
	}

	const changeSeriesTypeField = (type) => {
		setSeriesTypeField(type);
	}

	const changeSeriesLengthField = (length) => {
		if (length === "" || Number.isInteger(Number(length))) {
			setSeriesLengthField(length === "" ? "" : Number(length));
		}
	}

	const changeSeasonNumberField = (season) => {
		setSeasonNumberField(season);
	}

	const changeMatchdayNumberField = (matchday) => {
		setMatchdayNumberField(matchday);
	}

	const changeTeamField = (team, teamNumber) => {
		const tempTeamFields = [... teamFields];
		tempTeamFields[teamNumber]= team;
		setTeamFields(tempTeamFields);
		changeTeamNameField(team.name, teamNumber);
		changeSoccerTeamField(team.soccerTeamName, teamNumber);
	}

	const changeTierField = (tier) => {
		setTierField(tier);
	}

	const setConfigValuesFromLocalStorage = () => {
		const loadedConfig = JSON.parse(localStorage.getItem("config"));
		setConfig(loadedConfig);
		setTeamNameFields([loadedConfig.teams[0].name, loadedConfig.teams[1].name]);
		setSoccerTeamFields([loadedConfig.teams[0].franchise, loadedConfig.teams[1].franchise]);
		setTeamLogoFields([loadedConfig.teams[0].logo, loadedConfig.teams[1].logo]);
		setSeriesTypeField(loadedConfig.series.type);
		setSeriesLengthField(loadedConfig.series.maxGames);
		setShowSeriesField(loadedConfig.series.show);
		setHeaderField(loadedConfig.general.headers[0]);
		setBrandLogoField(loadedConfig.general.brandLogo);
		setSeasonNumberField(loadedConfig.general.season);
		setMatchdayNumberField(loadedConfig.general.matchday);
		changeTierField(loadedConfig.general.tier);
		changeStreamTypeField(loadedConfig.general.streamType, true);
	}

	const setConfigValuesToDefault = () => {
		setTeamFields(["", ""]);
		setTierField("");
		setConfig(defaultConfig);
		localStorage.setItem("config", JSON.stringify(defaultConfig));
	}

	const setSeriesScoreToDefault = () => {
		setSeriesScore(defaultSeriesScore);
		setSeriesScoreFields(defaultSeriesScore);
		localStorage.setItem("seriesScore", JSON.stringify(defaultSeriesScore))
	}

	const setAllValuesToDefault = () => {
		setConfigValuesToDefault();
		setSeriesScoreToDefault();
		closeDialog();
	}

	const setSeriesScoreFromLocalStorage = () => {
		const seriesScoreIn = JSON.parse(localStorage.getItem("seriesScore"));
		setSeriesScore(seriesScoreIn);
		setSeriesScoreFields(seriesScoreIn);
	}

	// TODO: handle multiple headers
	const changeHeaderField = (text) => {
		setHeaderField(text);
	}

	const changeRoundField = (text) => {
		setRoundField(text);
	}


	const changeBrandLogoField = (logo) => {
		setBrandLogoField(logo);
	}

	const setNamesFromDropdowns = () => {
		const tempTeamNames = [];
		const tempSoccerTeams = [];
		for (let team in teamFields) {
			if (teamFields[team].hasOwnProperty("soccerTeamName")) {
				tempTeamNames[team] = teamFields[team].name;
				tempSoccerTeams[team] = teamFields[team].soccerTeamName;
			} else {
				tempTeamNames[team] = teamNameFields[team];
				tempSoccerTeams[team] = soccerTeamFields[team];
			}
		}
		setTeamNameFields(tempTeamNames);
		setSoccerTeamFields(tempSoccerTeams);
	}

	// don't set team names based on dropdowns on initial load
	const changeStreamTypeField = (streamType, skipTeamNames) => {
		setStreamTypeField(streamType);

		switch(streamType) {
			case "SGL-regular":
				changeBrandLogoField("sgl-logo.png");
				if (!skipTeamNames) {
					setNamesFromDropdowns();
				}
				break;

			case "SGL-playoffs":
				changeBrandLogoField("sgl-logo.png");
				if (!skipTeamNames) {
					setNamesFromDropdowns();
				}
				break;

			case "SGL-event":
				changeBrandLogoField("sgl-logo.png");
			break;

			default:
				if(brandLogoField === "sgl-logo.png") {
					changeBrandLogoField("");
				}

				break;
		}

	}

	const resetFieldValues = () => {
		setConfigValuesFromLocalStorage();
		setSeriesScoreFromLocalStorage();
	}

	const triggerViewState = (triggerState, endState) => {
		if (viewState !== triggerState && viewState !== endState) {
			setViewState(triggerState);
			localStorage.setItem("viewstate", triggerState);
		}
	}

	const saveToLocalStorage = () => {
		const playerStats = [];
		const teamStats = [];

		// check for required fields
		if (streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs") {

			if (tierField === "") {
				openSnackbar("Tier and teams must be chosen.");
				return;
			}

			if (teamFields.includes("")) {
				openSnackbar("Teams must be chosen.");
				return;
			}

			if (teamFields[0] === teamFields[1]) {
				openSnackbar("A team can't play itself.");
				return;
			}

			if (seasonNumberField === "" || seasonNumberField < 1) {
				openSnackbar("Season number must be set.");
				return;
			}

			if (streamTypeField === "SGL-regular" && (matchdayNumberField === "" || matchdayNumberField < 1)) {
				openSnackbar("Matchday number must be set.");
				return;
			}

			if (showSeriesField && seriesScoreFields.includes("")) {
				openSnackbar("Team series score can't be blank.");
				return;
			}

			if (streamTypeField === "SGL-playoffs" && !roundField) {
				openSnackbar("Playoff round can't be blank.");
				return;
			}

			// only load stats when series score set to 0-0
			if (seriesScoreFields[0] === 0 && seriesScoreFields[1] === 0) {
				const apiPromises = [];
				openDialog("loading");

				// load team stats
					apiPromises.push(
						getTeamStatsByTeams([teamFields[0].code, teamFields[1].code])
							.then((loadedTeamStats) => {
								teamStats.push(...loadedTeamStats);
							})
							.catch((error) => {
								console.error(error);
								openSnackbar("Error getting team stats from sheets");
							})
					);


				//load player stats
					apiPromises.push(
						getPlayerStatsByTeams([teamFields[0].code, teamFields[1].code])
						.then((loadedPlayerStats) => {
							playerStats.push(...loadedPlayerStats);
						})
						.catch((error) => {
							console.error(error);
							openSnackbar("Error getting team stats from sheets");
						})
					)

				Promise.all(apiPromises)
					.then(() => {
						// save pregame stats to local storagge
						localStorage.setItem("pregameStats", JSON.stringify({
							playerStats,
							teamStats,
						}));

						closeDialog();
					})
					.catch((error) => {
						closeDialog();
						console.error(error);
						openSnackbar("Error loading from stats service");
					});

			}


		} else {
			// not SGL official

			if (showSeriesField && seriesScoreFields.includes("")) {
				openSnackbar("Team series score can't be blank.");
				return;
			}

			if (headerField === "") {
				openSnackbar("Header can't be blank.");
				return;
			}

		}

		setSeriesScore(seriesScoreFields);
		localStorage.setItem("seriesScore", JSON.stringify(seriesScoreFields));

		const newConfig = {
			general: {
				...config.general,
				headers: [headerField],
				streamType: streamTypeField,
				season: seasonNumberField,
				matchday: matchdayNumberField,
				round: roundField,
				tier: tierField,
				brandLogo: brandLogoField,
				theme: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" || streamTypeField === "SGL-event" ? "sgl" : "default",
				// TODO: select transition for non-SGL streams
				transition: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" || streamTypeField === "SGL-event" ? "hexGrow" : "stripeWipe",
			},
			series: {
				show: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ? true : showSeriesField,
				type: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ? "bestof" : seriesTypeField,
				display: "both",
				maxGames: seriesLengthField,
				override: "",
			},
			teams: [
				{
					...config.teams[0],
					name: teamNameFields[0],
					franchise: soccerTeamFields[0],
					logo: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ? teamFields[0].logo : teamLogoFields[0],
					bgColor: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ? teamFields[0].bgColor : null,
				},
				{
					...config.teams[1],
					name: teamNameFields[1],
					franchise: soccerTeamFields[1],
					logo: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ? teamFields[1].logo : teamLogoFields[1],
					bgColor: streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ? teamFields[1].bgColor : null,
				},
			],
		};

		if (streamTypeField !== "other") {
			newConfig.teams[0].shortName = teamFields[0].shortName;
			newConfig.teams[1].shortName = teamFields[1].shortName;
		}

		localStorage.setItem("config", JSON.stringify(newConfig));
		setConfig(newConfig);
		setHeaderField(headerField);
		setFieldsWithChanges([]);

		localStorage.setItem("interview", JSON.stringify({
			name: interviewNameField,
			team: interviewTeamField,
		}));
		setInterviewSaved({
			name: interviewNameField,
			team: interviewTeamField,
		});

	}



	return (
		Array.isArray(teamData) && config.hasOwnProperty("teams") ?

			<div id="ControlPanel">

				<Dialog
					open={currentDialog === "customId"}
					onClose={closeDialog}
				>
					<DialogContent>
						<p>Make this unique; don't cross the streams.</p>
						<FormControl variant="outlined" required>
							<InputLabel htmlFor="newClientId">New Client ID</InputLabel>
							<OutlinedInput
								id="newClientId"
								label="New Client ID"
								onChange={(e) => setCustomClientId(e.target.value)}
								value={customClientId}
							/>
						</FormControl>
					</DialogContent>
					<DialogActions>
						<Button onClick={saveCustomIdDialog}>Save</Button>
						<Button color="inherit" onClick={closeDialog}>Cancel</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={currentDialog === "confirmDefault"}
					onClose={closeDialog}
				>
					<DialogContent>
						<p>This will set <strong><em>everything</em></strong> to default and save immediately.  Are you sure?</p>
					</DialogContent>
					<DialogActions>
						<Button onClick={setAllValuesToDefault}>Set to Default</Button>
						<Button color="inherit" onClick={closeDialog}>Cancel</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={currentDialog === "loading"}
					onClose={closeDialog}
				>
					<DialogContent>
						<p>Loading...</p>
					</DialogContent>
				</Dialog>

				<Snackbar
					autoHideDuration={4000}
					open={snackbarIsOpen}
					onClose={closeSnackbar}
					message={snackbarMessage}
				/>

				<h1>SGL overlay control panel</h1>

				<ThemeProvider theme={panelTheme}>

					<Container>
						<Grid container spacing={0} className="idGrid">

							<Grid size={{xs: 12, md: 5}}>
								<Item >
									<strong>Stats page URL:</strong><br />{thisUrl.protocol}//{thisUrl.host}/stats/{clientId}
								</Item>
							</Grid>

							<Grid size={{xs: 12, md: 4}} justifyContent="flex-end" offset="auto" display="flex">
								<Item>
									<Button
										size="small"
										variant="contained"
										color="inherit"
										onClick={() => {setCurrentDialog("customId")}}
									>
										Set Custom Id
									</Button>
									<Button
										variant="outlined"
										color="warning"
										onClick={generateRandomClientId}
									>
										New Random Id
									</Button>
								</Item>
							</Grid>

		{/* can't copy from within OBS; figure out later? */
		/* 					<Grid size={{xs: 12, md: 4}}>
								<Item>
									<Button variant="contained" onClick={copyStatsUrlToClipboard}>Copy Stats URL</Button>
									<Button variant="outlined" onClick={copyClientIdToClipboard}>Copy Id</Button>
								</Item>
							</Grid>
		*/}

							</Grid>

							<Grid container spacing={2} className="buttons">

								<Grid size={12}>
									<Button
										disabled={!fieldsWithChanges.length}
										variant="contained"
										color="success"
										onClick={saveToLocalStorage}
									>
										Save
									</Button>
									<Button
										disabled={!fieldsWithChanges.length}
										variant="outlined"
										color="warning"
										onClick={resetFieldValues}
									>
										Reset
									</Button>
									<Button
										variant="outlined"
										color="error"
										onClick={() => openDialog("confirmDefault")}
									>
										Set to Default
									</Button>
									<Button
										variant="outlined"
										color="secondary"
										onClick={() => loadScheduleManual()}
									>
										Refresh Schedule
									</Button>
								</Grid>

							</Grid>

							<Grid container size={12} spacing={0} className="gridRow">

								<Grid size={{xs: 12, md: 3}}>
									<Item>
										<FormControl size="small" fullWidth>
											<InputLabel id="streamTypeLabel" shrink>Stream Type</InputLabel>
											<Select
												notched
												labelId="streamTypeLabel"
												id="streanType"
												value={streamTypeField}
												label="Stream Type"
												className={fieldHasChanges("streamTypeField") ? "changedField" : ""}
												onChange={(e) => changeStreamTypeField(e.target.value)}
											>
												<MenuItem value="SGL-regular">SGL Regular Season</MenuItem>
												<MenuItem value="SGL-playoffs">SGL Cup</MenuItem>
												<MenuItem value="SGL-event">SGL Other</MenuItem>
												<MenuItem value="other">No SGL branding</MenuItem>
											</Select>
										</FormControl>
									</Item>
								</Grid>

							</Grid>


								{streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ?

									<>

										<Grid container size={12} spacing={0} className="gridRow">

											<Grid size={3}>
												<Item>
													<TextField
														fullWidth
														required
														inputProps={{
															min: 1,
															step: 1,
														}}
														id="seasonNumber"
														type="number"
														size="small"
														label="Season"
														value={seasonNumberField}
														onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
														onChange={(e) => changeSeasonNumberField(e.target.value)}
														className={`${fieldHasChanges("seasonNumberField") ? "changedField" : ""} ${seasonNumberField === "" || seasonNumberField < 1 ? "errorField" : ""}`}
													/>
												</Item>
											</Grid>

											{streamTypeField === "SGL-regular" ?

												<Grid size={3}>
													<Item>
														<TextField
															fullWidth
															required
															inputProps={{
																min: 1,
																step: 1,
															}}
															id="matchdayNumberField"
															type="number"
															size="small"
															label="Matchday"
															value={matchdayNumberField}
															disabled={streamTypeField === "SGL-playoffs"}
															onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
															onChange={(e) => changeMatchdayNumberField(e.target.value)}
															className={`${fieldHasChanges("matchdayNumberField") ? "changedField" : ""} ${streamTypeField === "SGL-regular" && (matchdayNumberField === "" || matchdayNumberField < 1) ? "errorField" : ""}`}
														/>
													</Item>
												</Grid>

											: null}

											{Array.isArray(tierList) || tierList.length ?

												<Grid size={4}>
													<Item>
														<FormControl size="small" fullWidth>
															<InputLabel id="tierFieldLabel" shrink>Tier</InputLabel>
															<Select
																notched
																labelId="tierFieldLabel"
																id="tierField"
																value={tierField}
																required
																label="Tier"
																onChange={(e) => changeTierField(e.target.value)}
																className={`${fieldHasChanges("tierField") ? "changedField" : ""} ${tierField === "" ? "errorField" : ""}`}
															>
																{tierList
																	.sort((a,b) => Number(a.position) < Number(b.position) ? 1 : Number(a.position) > Number(b.position) ? -1 : 0)
																	.map(tier => (
																		<MenuItem key={tier.id} value={tier.name}>{tier.name}</MenuItem>
																))}
															</Select>
														</FormControl>
													</Item>
												</Grid>

											: null}

											{streamTypeField === "SGL-playoffs" ?

												<Grid size={5}>

													<Item>
														<FormControl variant="outlined" size="small" fullWidth>
															<InputLabel shrink htmlFor={`round`}>Round</InputLabel>
															<OutlinedInput
																notched
																id="round"
																label="Round"
																onChange={(e) => changeRoundField(e.target.value)}
																value={roundField}
																className={`${fieldHasChanges(`roundField`) ? "changedField" : ""} ${streamTypeField === "SGL-playoffs" && roundField === "" ? "errorField" : ""}`}
															/>
														</FormControl>
													</Item>

												</Grid>

											: null}

										</Grid>

									</>

								:
									<>

										<Item>
											<FormControl variant="outlined" size="small" fullWidth>
												<InputLabel shrink htmlFor={`header`}>Header</InputLabel>
												<OutlinedInput
													notched
													id="header"
													label="Header"
													onChange={(e) => changeHeaderField(e.target.value)}
													value={headerField}
													className={`${fieldHasChanges(`headerField`) ? "changedField" : ""} ${headerField === "" ? "errorField" : ""}`}
												/>
											</FormControl>
										</Item>

										{streamTypeField === "other" ?

										<Item>
											<FormControl variant="outlined" size="small" fullWidth>
												<InputLabel shrink htmlFor={`brandLogo`}>Brand Logo</InputLabel>
												<OutlinedInput
													notched
													id="brandLogo"
													label="Brand Logo"
													onChange={(e) => changeBrandLogoField(e.target.value)}
													value={brandLogoField}
													className={`${fieldHasChanges(`brandLogoField`) ? "changedField" : ""}`}
												/>
											</FormControl>
										</Item>



										: null}

									</>

								}



								{/* TODO: Handle custom series text */}

								<Grid container size={12} spacing={0} className="gridRow">

									{streamTypeField !== "SGL-regular" && streamTypeField !== "SGL-playoffs" ?

										<Grid size={3}>
											<Item>
												<FormControl size="small" fullWidth>
													<InputLabel id="showSeriesLabel" shrink>Show Series?</InputLabel>
													<Select
														notched
														labelId="showSeriesLabel"
														id="showSeries"
														value={showSeriesField}
														label="Show Series?"
														className={fieldHasChanges("showSeriesField") ? "changedField" : ""}
														onChange={(e) => changeShowSeriesField(e.target.value)}
													>
														<MenuItem value={true}>Yes</MenuItem>
														<MenuItem value={false}>No</MenuItem>

													</Select>
												</FormControl>
											</Item>
										</Grid>

									: null}

										{showSeriesField === true ?

											<>

												{streamTypeField !== "SGL-regular" && streamTypeField !== "SGL-playoffs" ?

													<Grid size={6}>
														<Item>
															<FormControl size="small" fullWidth>
																<InputLabel id="seriesTypeLabel" shrink>Series Type</InputLabel>
																<Select
																	notched
																	labelId="seriesTypeLabel"
																	id="seriesType"
																	value={seriesTypeField}
																	label="Series Type"
																	className={fieldHasChanges("seriesTypeField") ? "changedField" : ""}
																	onChange={(e) => changeSeriesTypeField(e.target.value)}
																>
																	<MenuItem value="bestof">Best of</MenuItem>
																	<MenuItem value="set">Set number of games</MenuItem>
																	<MenuItem value="unlimited">Unlimited</MenuItem>
																</Select>
															</FormControl>

														</Item>
													</Grid>

												: null}

												<Grid size={3}>
													<Item>
														<TextField
															fullWidth
															required
															inputProps={{
																min: 1,
																step: 1,
															}}
															id="seriesLength"
															type="number"
															size="small"
															label="Games"
															disabled={seriesTypeField === "unlimited"}
															value={seriesLengthField}
															onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
															onChange={(e) => changeSeriesLengthField(e.target.value)}
															className={`${fieldHasChanges("seriesLengthField") ? "changedField" : ""} ${seriesTypeField !== "unlimited" && !seriesLengthField ? "errorField" : ""}`}
														/>
													</Item>
												</Grid>

											</>

										: null}

									</Grid>

									{streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs" ?

										<Grid container size={12} spacing={0} className="gridRow pregameButtons">
											<Grid size={12}>
												<h2 >Overlay Card Control</h2>
											</Grid>

											<Grid container size={12} justifyItems={"center"}>

												<Item justifyItems={"center"}>

													<Button
														color="secondary"
														variant={viewState === "schedule" ? "contained" : "outlined"}
														disabled={viewState === "schedule" || viewState === "triggerSchedule"}
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "schedule" ? "yellowgreen" : "",
														}}
														onClick={() => {triggerViewState("triggerSchedule", "schedule")}}
													>Schedule</Button>

													<Button
														color="secondary"
														variant={viewState === "standings" ? "contained" : "outlined"}
														disabled={viewState === "standings" || viewState === "triggerStandings"}
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "standings" ? "yellowgreen" : "",
														}}
														onClick={() => {triggerViewState("triggerStandings", "standings")}}
													>Standings</Button>

												</Item>

												<Item textAlign={"center"}>

													<Button
														color="primary"
														variant={viewState === "matchup" ? "contained" : "outlined"}
														disabled={viewState === "matchup" || viewState === "triggerMatchup"}
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "matchup" ? "yellowgreen" : "",
														}}
														onClick={() => {triggerViewState("triggerMatchup", "matchup")}}
													>Matchup</Button>

													<Button
														color="success"
														variant={viewState === "teamStats" ? "contained" : "outlined"}
														disabled={viewState === "teamStats" || viewState === "triggerTeamStats"}
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "teamStats" ? "yellowgreen" : "",
														}}
														onClick={() => {triggerViewState("triggerTeamStats", "teamStats")}}
													>Team stats</Button>

													<Button
														variant={viewState === "playerStats0" ? "contained" : "outlined"}
														disabled={viewState === "playerStats0" || viewState === "triggerPlayerStats0"}
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "playerStats0" ? "yellowgreen" : `#${config.teams[0].color ? config.teams[0].color : teamData[0].color_primary}`,
															backgroundColor: viewState === "playerStats0" ? `#${config.teams[0].color ? config.teams[0].color : teamData[0].color_primary}` : null,
															color: viewState === "playerStats0" ? null : `#${config.teams[0].color ? config.teams[0].color : teamData[0].color_primary}`,
														}}
														onClick={() => {triggerViewState("triggerPlayerStats0", "playerStats0")}}
													>Player stats 1</Button>

													<Button
														variant={viewState === "playerStats1" ? "contained" : "outlined"}
														disabled={viewState === "playerStats1" || viewState === "triggerPlayerStats1"}
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "playerStats1" ? "yellowgreen" : `#${config.teams[1].color ? config.teams[1].color : teamData[1].color_primary}`,
															backgroundColor: viewState === "playerStats1" ? `#${config.teams[1].color ? config.teams[1].color : teamData[1].color_primary}` : null,
															color: viewState === "playerStats1" ? null : `#${config.teams[1].color ? config.teams[1].color : teamData[1].color_primary}`,
														}}
														onClick={() => {triggerViewState("triggerPlayerStats1", "playerStats1")}}
													>Player stats 2</Button>

												</Item>

												<Item textAlign={"center"}>

													<Button
														variant={viewState === "live" ? "contained" : "outlined"}
														disabled={viewState === "live" || viewState === "triggerLive"}
														color="error"
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "live" ? "yellowgreen" : "",
														}}
														onClick={() => {triggerViewState("triggerLive", "live")}}
													>Live game</Button>

													<Button
														variant={viewState === "interview" ? "contained" : "outlined"}
														disabled={viewState === "interview" || viewState === "triggerInterview"}
														color="primary"
														style={{
															borderWidth: "2px",
															borderStyle: "solid",
															borderColor: viewState === "interview" ? "yellowgreen" : "",
														}}
														onClick={() => {triggerViewState("triggerInterview", "interview")}}
													>Interview</Button>

												</Item>

											</Grid>

										</Grid>

									: null}


							<Grid container size={12} spacing={2} className="mainPanelGrid">
								{teamData.map((team, teamnum) => (
								<Grid container
									spacing={0}
									key={teamnum}
									size={{xs:12, md: 6}}
									className={`team team${teamnum}`}
									style={{
										borderColor: `#${config.teams[teamnum].color ? config.teams[teamnum].color : team.color_primary}`,
									}}
								>

									<Grid size={12}>
										<Item>
											<strong>In Game:</strong> {team.name}
										</Item>
									</Grid>

									<Grid size={9}>
										<Item>
											{streamTypeField !== "SGL-regular" && streamTypeField !== "SGL-playoffs" ?
												<>
													<FormControl variant="outlined" size="small" fullWidth>
														<InputLabel shrink htmlFor={`teamNameField${teamnum}`}>Team Name</InputLabel>
														<OutlinedInput
															notched
															id={`teamNameField${teamnum}`}
															label="Team Name"
															onChange={(e) => changeTeamNameField(e.target.value, teamnum)}
															value={teamNameFields[teamnum]}
															placeholder={team.name}
															className={fieldHasChanges(`teamNameField${teamnum}`) ? "changedField" : ""}
														/>
													</FormControl><br />
													<FormControl variant="outlined" size="small" fullWidth>
														<InputLabel shrink htmlFor={`soccerTeamField${teamnum}`}>{streamTypeField === "other" ? "Org Name" : "Soccer Team Name"}</InputLabel>
														<OutlinedInput
															notched
															id={`soccerTeamField${teamnum}`}
															label={streamTypeField === "other" ? "Org Name" : "Soccer Team Name"}
															onChange={(e) => changeSoccerTeamField(e.target.value, teamnum)}
															value={soccerTeamFields[teamnum]}
															className={fieldHasChanges(`soccerTeamField${teamnum}`) ? "changedField" : ""}
														/>
													</FormControl>
													{/* TODO: upload team logo */}
													<FormControl variant="outlined" size="small" fullWidth>
														<InputLabel shrink htmlFor={`teamLogoField${teamnum}`}>Team Logo</InputLabel>
														<OutlinedInput
															notched
															id={`teamLogoField${teamnum}`}
															label="Team Logo"
															onChange={(e) => changeTeamLogoField(e.target.value, teamnum)}
															value={teamLogoFields[teamnum]}
															className={fieldHasChanges(`teamLogoField${teamnum}`) ? "changedField" : ""}
														/>
													</FormControl><br />
												</>
											: Array.isArray(teamList) && teamList.length && Array.isArray(tierList) && tierList.length > 0 && tierField ?
												<>
													<FormControl size="small" fullWidth>
														<InputLabel id={`teamField${teamnum}Label`} shrink>Team</InputLabel>
														<Select
															notched
															labelId={`teamField${teamnum}Label`}
															id={`teamField${teamnum}`}
															value={teamFields[teamnum]}
															required
															label="Team"
															className={`${fieldHasChanges(`teamField${teamnum}`) ? "changedField" : ""} ${teamFields[teamnum] === "" ? "errorField" : ""}`}
															onChange={(e) => changeTeamField(e.target.value, teamnum)}
														>
															{teamList
																.filter((t) =>
																	t.tier === tierList.filter((tier) => tier.name === tierField)[0].id)
																.sort((a,b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
																.map((team, i) => (
																	<MenuItem key={i} value={team}>{team.name} ({team.soccerTeamAbbreviation})</MenuItem>
															))}
														</Select>
													</FormControl>

												</>
											: null
											}
										</Item>
									</Grid>

									{(streamTypeField === "SGL-regular" || streamTypeField === "SGL-playoffs") || showSeriesField ?

										<Grid size={3}>
											<Item>
												<TextField
													required
													inputProps={{
														min: 0,
														step: 1,
													}}
													id={`seriesScoreField${teamnum}`}
													type="number"
													size="small"
													label="Games"
													value={seriesScoreFields[teamnum]}
													onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
													onChange={(e) => changeSeriesScoreField(e.target.value, teamnum)}
													className={`${fieldHasChanges(`seriesScoreField${teamnum}`) ? "changedField" : ""} ${seriesScoreFields[teamnum] === "" ? "errorField" : ""}`}
												/>
											</Item>
										</Grid>

									: null}

								</Grid>

							))}

						</Grid>

						{streamTypeField !== "other" ?

							<Grid container size={12} spacing={0} border={1} marginTop={3} className="mainPanelGrid">

								<Grid size={12} paddingLeft={1}>
									<p>Interview</p>
								</Grid>

								{Array.isArray(teamList) && teamList.length > 0 ?
									<Grid size={6} padding={1}>

										<FormControl size="small" fullWidth>
											<InputLabel id="interviewTeamFieldLabel" shrink>Team</InputLabel>
											<Select
												notched
												labelId="interviewTeamFieldLabel"
												id="interviewTeamField"
												value={interviewTeamField}
												label="Team"
												className={`${fieldHasChanges("InterviewTeamField") ? "changedField" : ""}`}
												onChange={(e) => setInterviewTeamField(e.target.value)}
											>
												<MenuItem value={interviewNoTeam}>(none)</MenuItem>
												{teamList
													.sort((a,b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
													.map((team, i) => (
														<MenuItem key={i} value={team}>{team.name} ({team.soccerTeamAbbreviation})</MenuItem>
												))}
											</Select>
										</FormControl>

									</Grid>

								: null}

								<Grid size={6}>
									<Item>
										<TextField
											required
											inputProps={{
												min: 0,
												step: 1,
											}}
											id="InterviewNameField"
											size="small"
											label="Name"
											value={interviewNameField}
											onChange={(e) => setInterviewNameField(e.target.value)}
											className={`${fieldHasChanges("InterviewNameField") ? "changedField" : ""}`}
										/>
									</Item>
								</Grid>

							</Grid>

						: null}

					</Container>

				</ThemeProvider>

			</div>

		:

			// TODO: Figure out the real issue?  Maybe useRef?
			<div>
				<p>Refresh this panel.  (Within OBS: right click in this panel, then click "Refresh".)</p>
				<p>If you&apos;ve already refreshed, ask for help.</p>
			</div>
	)

}

export default ControlPanel;
