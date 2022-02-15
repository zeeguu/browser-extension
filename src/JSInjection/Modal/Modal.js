import parse from "html-react-parser";
import {StyledModal, StyledButton} from "./Modal.styles"
export function Modal({ title, content, modalIsOpen, setModalIsOpen }) {
  const handleClose = () => {
    location.reload();
    setModalIsOpen(false);
  };

  return (
    <div>
      <script type="text/javascript" src="src/purify.js"></script>
    <StyledModal isOpen={modalIsOpen} className="Modal" overlayClassName="Overlay">
          <StyledButton onClick={handleClose} id="qtClose">X</StyledButton>
          <h1>{title}</h1>
          {parse(content)}
    </StyledModal>
    </div>
  );
}
