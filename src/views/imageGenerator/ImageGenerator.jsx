import React, { useEffect, useState } from "react";
import * as htmlToImage from "html-to-image";

import GeneratedMatchdaySchedule from "@/views/imageGenerator/GeneratedMatchdaySchedule";
import GeneratedStandings from "@/views/imageGenerator/GeneratedStandings";
// TODO: daily schedule

import { getSchedule } from "@/services/scheduleService";
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
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";

import ("@/style/imageGen.scss");

const currentSeason = 9; // TODO: set on new season
const defaultViewOptions = {
	scores: true,
	streams: true,
	times: true,
	today: true,
};

const imageSizes = [
	{
		id: "base",
		label: "Base",
		width: 1920,
		height: 1080,
	},
];

let panelTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#ffffff",
			secondary: "#999999",
		},
	},
});

panelTheme = createTheme(panelTheme, {
	palette: {
		splash: panelTheme.palette.augmentColor({
			color: {
				main: "#49dcee",
				secondary: "#199ade",
				dark: "#199ade",
				contrastText: "#e90000",
			},
			name: "splash",
		}),
	}
})

const Item = styled("div")(({ theme }) => ({
	background: "transparent",
	padding: theme.spacing(2),
	textAlign: "left",
	color: "#ffffff",
}));

// TODO: Make version for cup tournament (bracket?)

const ImageGenerator = () => {

	const [scheduleList, setScheduleList] = useState({});
	const [tierList, setTierList] = useState({});
	const [teamList, setTeamList] = useState({});

	const [season, setSeason] = useState(currentSeason);
	const [matchday, setMatchday] = useState(1);
	const [gameCount, setGameCount] = useState(1);
	const [tiers, setTiers] = useState(["",""]);

	const [viewOptions, setViewOptions] = useState(defaultViewOptions)

	const [imageType, setImageType] = useState("matchdaySchedule");

	const [generatorData, setGeneratorData] = useState({});
	const [generatedImages, setGeneratedImages] = useState([]);

	const [currentDialog, setCurrentDialog] = useState(null);
	const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	useEffect(() => {
		openDialog("loading");
		Promise.all([
			loadTeamList(),
			loadTierList(),
			loadSchedule(),
		])
			.then(() => {
				closeDialog();
			})
			.catch((error) => {
				closeDialog();
			});
		;
	}, []);

	const openDialog = (dialog) => {
		setCurrentDialog(dialog);
	}

	const closeDialog = (event, reason) => {
		if (reason && reason === "backdropClick") {
			return;
		}
		setCurrentDialog(null);
	}

	const openSnackbar = (message) => {
		setSnackbarMessage(message);
		setSnackbarIsOpen(true);
	}

	const closeSnackbar = () => {
		setSnackbarMessage(null);
		setSnackbarIsOpen(false);
	}

	const loadTierList = async () => {

		if (!Array.isArray(tierList) || tierList.length < 1 ) {
			getTierList()
				.then((loadedTierList) => {
					setTierList(loadedTierList);
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
				setScheduleList(loadedSchedule);
			})
			.catch((error) => {
				console.error(error);
				openSnackbar("Error getting schedule from sheets");
			});

	}

	const loadTeamList = async () => {

		if (!Array.isArray(teamList) || teamList.length < 1 ) {

			getTeamList()
				.then((loadedTeamList) => {
					setTeamList(loadedTeamList);
				})
				.catch((error) => {
					console.error(error);
					openSnackbar("Error getting team list from sheets");
				});
		}

	}

	const resetFields = () => {
		setSeason(currentSeason);
		setMatchday(1);
		setViewOptions(defaultViewOptions);
	}

	const toggleViewOption = (option) => {
		const options = Object.assign({}, JSON.parse(JSON.stringify(viewOptions)));
		options[option] = !options[option];
		setViewOptions(options);
	}

	const generate = () => {
		if (!season
			|| (imageType === "matchdaySchedule" && !matchday)
		) {
			openSnackbar("Please fill all fields.")
			return;
		}

		const genData = {
			imageType,
			ready: true,
			config: {
				general: {
					headers: [],
					theme: "sgl",
					streamType: "SGL-regular",
					matchday,
					season,
					brandLogo: "sgl-logo.png",
				}
			},
			matchday,
			season,
			schedule: scheduleList,
			teamList,
			tierList,
			viewOptions: Object.keys(viewOptions)
				.filter(option => !!viewOptions[option])
				.map((option) => option),
		};

		setGeneratorData(genData);
		openDialog("generating");
		setTimeout(() => {
			generateImageFiles();
		}, 2000);

	}

	const generateImageFiles = () => {
		const imageList = [];
		const promises = [];

		for (let imgData of imageSizes) {
			promises.push(
				generateImage(imgData)
					.then(imgUrl => {
						imageList.push({
							...imgData,
							url: imgUrl,
						});
					})
					.catch(error => {
						console.error(error);
						openSnackbar("Error generating images");
					})
			);
		}

		Promise.all(promises)
			.then(() => {
				setGeneratedImages(imageList)
				closeDialog();
			})
			.catch(error => {
				closeDialog();
				console.error(error);
				openSnackbar("Error generating images");
			});

	}

	const generateImage = async (imgData) =>
		htmlToImage
			.toPng(document.getElementById(imgData.id), {
				width: imgData.width,
				height: imgData.height,
			})
			.then(dataUrl => {
				// var img = new Image();
				// img.className = "pants";
				// img.src = dataUrl;
				// document.getElementById("result").appendChild(img);
				return dataUrl;
			})
			.catch(error => {
				openSnackbar("Error generating image");
				console.error("Error generating image", error);
			});

	return (
		<div id="ImageGenerator">

			<Dialog
				open={currentDialog === "loading"}
				onClose={closeDialog}
				disableEscapeKeyDown={true}

			>
				<DialogContent>
					<p>Loading...</p>
				</DialogContent>
			</Dialog>

			<Dialog
				open={currentDialog === "generating"}
				onClose={closeDialog}
			>
				<DialogContent>
					<p>Generating...</p>
				</DialogContent>
			</Dialog>

			<Snackbar
				autoHideDuration={4000}
				open={snackbarIsOpen}
				onClose={closeSnackbar}
				message={snackbarMessage}
			/>

			<div className="selectors">

				<ThemeProvider theme={panelTheme}>
					<Container>

						<Grid size={12} container>

							<Grid size={{xs: 12, md: 4}}>
								<Item>

									<p>Options</p>

									<FormControl size="small" fullWidth>
										<InputLabel id="imageTypeLabel" shrink>Image Type</InputLabel>
										<Select
											notched
											labelId="gameTypeLabel"
											id="imageType"
											value={imageType}
											required
											label="Image Type"
											onChange={(e) => setImageType(e.target.value)}
										>
											<MenuItem value="matchdaySchedule">Matchday Schedule</MenuItem>
											<MenuItem value="standings">Standings</MenuItem>
										</Select>
									</FormControl>

									<TextField
										fullWidth
										required
										inputProps={{
											min: 1,
											step: 1,
											max: currentSeason,
										}}
										id="season"
										type="number"
										size="small"
										label="Season"
										value={season}
										onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
										onChange={(e) => setSeason(e.target.value)}
										className={season === "" || season < 1 || season > currentSeason ? "errorField" : ""}
									/>

									{imageType === "matchdaySchedule" ?

										<>

											<TextField
												fullWidth
												required
												inputProps={{
													min: 1,
													step: 1,
												}}
												id="matchday"
												type="number"
												size="small"
												label="Matchday"
												value={matchday}
												// disabled={imageType !== "regular"}
												onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
												onChange={(e) => setMatchday(e.target.value)}
												className={matchday === "" || matchday < 1 ? "errorField" : ""}
											/>


											<span className="switchControl">
												<strong>Show times?</strong>
												<Switch
													checked={viewOptions.times}
													onChange={(e) => toggleViewOption("times")}
													color={viewOptions.times ? "success" : "primary"}
												/>
											</span>

											<span className="switchControl">
												<strong>Show scores?</strong>
												<Switch
													checked={viewOptions.scores}
													onChange={(e) => toggleViewOption("scores")}
													color={viewOptions.scores ? "success" : "primary"}
												/>
											</span>

											{viewOptions.times ?
												<>
													<span className="switchControl">
														<strong>Highlight today's games?</strong>
														<Switch
															checked={viewOptions.today}
															onChange={(e) => toggleViewOption("today")}
															color={viewOptions.today ? "success" : "primary"}
														/>
													</span>

													<span className="switchControl">
														<strong>Show stream icons?</strong>
														<Switch
															checked={viewOptions.streams}
															onChange={(e) => toggleViewOption("streams")}
															color={viewOptions.streams ? "success" : "primary"}
														/>
													</span>
												</>

											: null}

										</>

									: null}

									<div className="buttons">
										<Button onClick={generate} variant="contained">Generate</Button>
										<Button onClick={resetFields} color="error" variant="contained">Reset</Button>
									</div>

								</Item>

							</Grid>

						</Grid>

					</Container>
				</ThemeProvider>

			</div>

			{generatorData.hasOwnProperty("ready") && generatorData.ready ?

				<>

					<div className="sources">

						{imageSizes.map((img, index) =>

							generatorData.imageType === "matchdaySchedule" ?

								<GeneratedMatchdaySchedule
									key={index}
									genData={generatorData}
									imageData={img}
								/>

							: generatorData.imageType === "standings" ?

								<GeneratedStandings
									key={index}
									genData={generatorData}
									imageData={img}
								/>

							: null

						)}

					</div>

					<div className="output">
						{generatedImages.map((img, index) => (
							<div key={index} className="generatedImage">
								<div className="label">{img.label} ({img.width} x {img.height})</div>
								<img src={img.url} />
							</div>
						))}

					</div>

				</>

			: null}


		</div>
	);
};

export default ImageGenerator;
