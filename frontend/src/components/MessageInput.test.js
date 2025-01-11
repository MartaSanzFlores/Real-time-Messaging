import { render, screen, fireEvent } from "@testing-library/react";
import MessageInput from "./MessageInput";

describe("MessageInput", () => {

    test("renders a message input", () => {
        render(<MessageInput />); // verify that the component renders without crashing
        const input = screen.getByPlaceholderText("Enter your message");
        expect(input).toBeInTheDocument(); // verify that the input field is rendered
    });

    test("calls onSendMessage when the form is submitted", () => {
        const onSendMessage = jest.fn(); // create a mock function
        render(<MessageInput onSendMessage={onSendMessage} />);
        const input = screen.getByPlaceholderText("Enter your message");
        const button = screen.getByText("Send");
        // userEvent.type simulates typing in the input field
        fireEvent.change(input, { target: { value: "Hello, World!" } });
        // userEvent.click simulates a click event on the button
        fireEvent.click(button);
        expect(onSendMessage).toHaveBeenCalledWith("Hello, World!"); // verify that onSendMessage was called with the correct message
    });

    test("does not call onSendMessage when the message is empty", () => {
        const onSendMessage = jest.fn();
        render(<MessageInput onSendMessage={onSendMessage} />);
        const button = screen.getByText("Send");
        fireEvent.click(button);
        expect(onSendMessage).not.toHaveBeenCalled();
    });

});