import { PersonalInfoForm } from "./PersonalInfoForm";
import { SkillsForm } from "./SkillsForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { CertificationsForm } from "./CertificationsForm";
import { LanguagesForm } from "./LanguagesForm";
import { ProjectsForm } from "./ProjectsForm";
import { CoverLetterForm } from "./CoverLetterForm";
import { NoteForm } from "./NoteForm";

const FORMS = {
  personal: PersonalInfoForm,
  skills: SkillsForm,
  experience: ExperienceForm,
  education: EducationForm,
  certifications: CertificationsForm,
  languages: LanguagesForm,
  projects: ProjectsForm,
  note: NoteForm,
  coverLetter: CoverLetterForm,
};

export function EditorPanel({ activeSection }) {
  const FormComponent = FORMS[activeSection];

  return (
    <div className="w-full h-full bg-gray-50 overflow-y-auto p-5">
      {FormComponent ? (
        <FormComponent />
      ) : (
        <div className="text-center text-gray-400 py-12 text-sm">
          Sezione non trovata
        </div>
      )}
    </div>
  );
}
