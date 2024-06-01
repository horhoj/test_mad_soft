import styles from './QuestionView.module.scss';

interface QuestionViewProps {
  text: string;
}
export function QuestionView({ text }: QuestionViewProps) {
  return (
    <div className={styles.QuestionView}>
      <strong>{text}</strong>
    </div>
  );
}
