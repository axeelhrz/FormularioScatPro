"use client";

import { useState, useEffect } from "react";
import styles from "./ScatInterface.module.css";
import EvaluacionContent from "./content/EvaluacionContent";
import ContactoContent from "./content/ContactoContent";
import CausasInmediatasContent from "./content/CausasInmediatasContent";
import CausasBasicasContent from "./content/CausasBasicasContent";
import NecesidadesControlContent from "./content/NecesidadesControlContent";
import { useScatData } from "../../contexts/ScatContext";
import {
	InfoIcon,
	SaveIcon,
	GridIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
} from "./icons/Icons";

const scatSections = [
	{
		id: "evaluacion",
		title: "EVALUACIÓN POTENCIAL DE PERDIDA SI NO ES CONTROLADO",
		component: EvaluacionContent,
	},
	{
		id: "contacto",
		title: "Tipo de Contacto o Cuasi Contacto con Energía o Sustancia",
		component: ContactoContent,
	},
	{
		id: "causas-inmediatas",
		title: "(CI) Causas Inmediatas o Directas",
		component: CausasInmediatasContent,
	},
	{
		id: "causas-basicas",
		title: "(CB) Causas Básicas / Subyacentes",
		component: CausasBasicasContent,
	},
	{
		id: "necesidades-control",
		title: "(NAC) Necesidades de Acción de Control (NAC) = Falta de Control",
		component: NecesidadesControlContent,
	},
];

function ScatInterface({ onNavigateToBase, onNavigateToProjects, onNavigateToDescription, formData }) {
	const [activeSection, setActiveSection] = useState("evaluacion");
	const { setProjectData, hasData } = useScatData();

	// Guardar datos del proyecto cuando se reciban
	useEffect(() => {
		if (formData) {
			setProjectData(formData);
		}
	}, [formData, setProjectData]);

	const handleSectionClick = (sectionId) => {
		setActiveSection(sectionId);
	};

	const getCurrentSectionIndex = () => {
		return scatSections.findIndex(section => section.id === activeSection);
	};

	const goToPreviousSection = () => {
		const currentIndex = getCurrentSectionIndex();
		if (currentIndex > 0) {
			setActiveSection(scatSections[currentIndex - 1].id);
		}
	};

	const goToNextSection = () => {
		const currentIndex = getCurrentSectionIndex();
		if (currentIndex < scatSections.length - 1) {
			setActiveSection(scatSections[currentIndex + 1].id);
		}
	};

	const canGoPrevious = () => {
		return getCurrentSectionIndex() > 0;
	};

	const canGoNext = () => {
		return getCurrentSectionIndex() < scatSections.length - 1;
	};

	const handleBackToMenu = () => {
		console.log("handleBackToMenu called");
		if (onNavigateToBase) {
			onNavigateToBase();
		}
	};

	const handleSaveProgress = () => {
		// Los datos se guardan automáticamente en el contexto
		console.log("Progreso guardado automáticamente");
		alert("Progreso guardado exitosamente");
	};

	const handleShowInfo = () => {
		const currentSection = scatSections.find(section => section.id === activeSection);
		alert(`Información sobre: ${currentSection?.title}`);
	};

	const handleShowGrid = () => {
		console.log("handleShowGrid called");
		console.log("onNavigateToProjects function:", onNavigateToProjects);
		if (onNavigateToProjects) {
			console.log("Calling onNavigateToProjects");
			onNavigateToProjects();
		} else {
			console.error("onNavigateToProjects is not available");
		}
	};

	const handleCompleteAnalysis = () => {
		if (hasData()) {
			if (onNavigateToDescription) {
				onNavigateToDescription();
			}
		} else {
			alert("Por favor, complete al menos una sección antes de finalizar el análisis.");
		}
	};

	const ActiveComponent =
		scatSections.find((section) => section.id === activeSection)?.component ||
		EvaluacionContent;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<div className={styles.headerLeft}>
						<button 
							className={styles.backToMenuButton}
							onClick={handleBackToMenu}
							title="Volver al menú principal"
						>
							← Menú Principal
						</button>
					</div>
					<div className={styles.headerCenter}>
						<h1 className={styles.title}>TABLA SCAT</h1>
						<h2 className={styles.subtitle}>
							Técnica de Análisis Sistemático de las Causas
						</h2>
					</div>
					<div className={styles.headerRight}>
						<div className={styles.sectionCounter}>
							{getCurrentSectionIndex() + 1} de {scatSections.length}
						</div>
						<button 
							className={styles.completeButton}
							onClick={handleCompleteAnalysis}
							title="Finalizar análisis y ver resumen"
						>
							Finalizar Análisis
						</button>
					</div>
				</div>
			</div>

			<div className={styles.navigationContainer}>
				<div className={styles.navigationHeader}>
					<button 
						className={`${styles.navArrow} ${!canGoPrevious() ? styles.disabled : ''}`}
						onClick={goToPreviousSection}
						disabled={!canGoPrevious()}
						title="Sección anterior"
					>
						<ArrowLeftIcon />
					</button>
					<div className={styles.currentSectionTitle}>
						{scatSections.find(section => section.id === activeSection)?.title}
					</div>
					<button 
						className={`${styles.navArrow} ${!canGoNext() ? styles.disabled : ''}`}
						onClick={goToNextSection}
						disabled={!canGoNext()}
						title="Siguiente sección"
					>
						<ArrowRightIcon />
					</button>
				</div>
				
				<div className={styles.navigationButtons}>
					{scatSections.map((section, index) => (
						<button
							key={section.id}
							onClick={() => handleSectionClick(section.id)}
							className={`${styles.navButton} ${
								activeSection === section.id ? styles.activeButton : ""
							}`}
							title={section.title}
						>
							<div className={styles.navButtonNumber}>{index + 1}</div>
							<div className={styles.navButtonText}>{section.title}</div>
						</button>
					))}
				</div>
			</div>

			<div className={styles.contentArea}>
				<ActiveComponent />
			</div>

			<div className={styles.bottomNav}>
				<button 
					className={styles.iconButton}
					onClick={handleShowInfo}
					title="Información"
				>
					<InfoIcon />
				</button>
				<button 
					className={styles.iconButton}
					onClick={handleSaveProgress}
					title="Guardar progreso"
				>
					<SaveIcon />
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton}`}
					onClick={handleShowGrid}
					title="Ver proyectos"
				>
					<GridIcon />
				</button>
				<button
					className={`${styles.iconButton} ${styles.darkButton} ${!canGoPrevious() ? styles.disabled : ''}`}
					onClick={goToPreviousSection}
					disabled={!canGoPrevious()}
					title="Sección anterior"
				>
					<ArrowLeftIcon />
				</button>
				<button 
					className={`${styles.iconButton} ${styles.darkButton} ${!canGoNext() ? styles.disabled : ''}`}
					onClick={goToNextSection}
					disabled={!canGoNext()}
					title="Siguiente sección"
				>
					<ArrowRightIcon />
				</button>
			</div>

			{/* Progress Indicator */}
			<div className={styles.progressIndicator}>
				<div className={styles.progressBar}>
					<div 
						className={styles.progressFill}
						style={{ width: `${((getCurrentSectionIndex() + 1) / scatSections.length) * 100}%` }}
					></div>
				</div>
				<div className={styles.progressText}>
					Progreso: {getCurrentSectionIndex() + 1}/{scatSections.length}
				</div>
			</div>
		</div>
	);
}

export default ScatInterface;