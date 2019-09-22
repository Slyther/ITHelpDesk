import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const InputModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.onCreate();
            }
          }}>
          {props.inputs.map((input) => {
            return (
              <Form.Group as={Row} controlId={input.valueId} key={input.valueId}>
                <Form.Label column sm={4}>{input.label}</Form.Label>
                <Col sm={8}>
                  {
                    (input.type === 'select') ? 
                      <Form.Control
                      onChange={props.handleChange}
                      value={input.value || ''}
                      as={input.type}
                      required={input.required}>
                        {
                          input.options.map((option) => {
                            return (<option key={option.id} value={option.id}>{option.option}</option>);
                          })
                        }
                      </Form.Control>
                      :
                      <Form.Control
                      onChange={props.handleChange}
                      value={input.value || ''}
                      as={input.type}
                      placeholder={input.placeholder}
                      required={input.required}>
                    </Form.Control>
                  }
                  <Form.Control.Feedback type="invalid">
                    Please check this field!
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onCreate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InputModal;
