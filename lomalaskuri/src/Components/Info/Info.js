import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import arrow from "../../Icons/arrow_forward_ios-24px.svg";
import { useHistory } from "react-router-dom";
import { useRotateDetector } from "./RotateDetector";

import Side1 from "./Side1";
import Side2 from "./Side2";
import Side3 from "./Side3";

//Info page should be as fancy as possible without sacrificing usability or performance
export function Info(props) {
	const [visibleSide, setVisibleSide] = useState(0);
	const [showScrollSign, setShowScrollSign] = useState(true);
	const [cubeSides, setCubeSides] = useState([
		<Side1 />,
		<Side2 toggleTheme={props.toggleTheme} themes={props.themes} />,
		<Side3 />,
		<Side1 />,
	]);
	const infoPages = useMemo(
		() => [
			<Side1 />,
			<Side2 toggleTheme={props.toggleTheme} themes={props.themes} />,
			<Side3 />,
		],
		[props]
	);
	const history = useHistory();
	const infoEl = useRef(null);
	const cubeEl = useRef(null);
	const { rotateStatus, resetStatus } = useRotateDetector(infoEl);
	const rotateCube = useCallback(
		//handles rotating the non-euclidean cube
		(newSide) => {
			if (!(newSide < visibleSide && (newSide + 1) % 3 === 0)) {
				setShowScrollSign(false); //When the user has understood that you can rotate the cube, hide the hint.
				console.log(newSide);
				setVisibleSide(newSide);
				let oldCubeSides = [...cubeSides];
				oldCubeSides[(visibleSide - 1) % 4] = infoPages[(visibleSide - 1) % 3];
				oldCubeSides[(visibleSide) % 4] = infoPages[(visibleSide) % 3];
				oldCubeSides[(visibleSide + 1) % 4] = infoPages[(visibleSide + 1) % 3];
				setCubeSides(oldCubeSides);
				cubeEl.current.style.transform = `translateZ(-40vmin) rotateX(${
					newSide * 90
				}deg)`;
			}
		},
		[cubeSides, infoPages, visibleSide]
	);
	useEffect(() => {
		//Handles rotating the cube
		if (rotateStatus !== 0) {
			rotateCube(rotateStatus + visibleSide);
			resetStatus();
		}
	}, [rotateStatus, visibleSide, resetStatus, rotateCube]);

	const indicatorBtns = [];
	for (let i = 0; i <= infoPages.length - 1; i++) {
		indicatorBtns.push(
			<div onClick={() => rotateCube((Math.floor(visibleSide/3)*3) + i)} key={"indicatorBtn" + i}></div>
		);
	}
	function toggle() {
		props.toggleTheme(props.themes.login);
	}
	function goBack() {
		history.goBack();
	}
	return (
		<div ref={infoEl} id="infoPage">
			<div ref={cubeEl} className={`cube`}>
				{cubeSides.map((elem, index) => (
					<section
						key={`side${index + 1}`}
						className={`cubeSide cubeSide${index + 1}`}>
						{elem}
					</section>
				))}
			</div>
			<div className={`pageIndicator onSide${(visibleSide % 3) + 1}`}>
				{indicatorBtns}
			</div>
			{showScrollSign && (
				<img className="scrollSign" onClick={() => rotateCube(2)} src={arrow} />
			)}
			<img
				className="darkIcon"
				alt="vaihda dark themeen"
				onClick={toggle}
				src="icons8-moon-symbol.svg"
			/>
			<button className="backArrow linkLookALike" onClick={goBack}>
				<img alt="close" src={arrow}></img>
			</button>
		</div>
	);
}
