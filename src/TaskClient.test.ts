import axios from "axios";
import { fetchTasks, saveTasks } from "./TaskClient";
import TaskStatus from "./models/TaskStatus";

describe("Task Client", () => {
  it("fetchTasks should invoke axios get", () => {
    const spy = jest.spyOn(axios, "get").mockResolvedValue([]);

    fetchTasks();

    expect(spy).toHaveBeenCalledWith(
      "https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json"
    );
  });

  it("fetchTasks should return Task list", async () => {
    const now = new Date();
    jest.spyOn(axios, "get").mockResolvedValue({
      data: [
        {
          id: "1",
          name: "Finish course",
          createdOn: now,
          status: TaskStatus.COMPLETE,
        },
      ],
    });

    const data = await fetchTasks();

    expect(data).toEqual([
      {
        id: "1",
        name: "Finish course",
        createdOn: now,
        status: TaskStatus.COMPLETE,
      },
    ]);
  });

  it("saveTasks should invoke axios put", () => {
    const now = new Date();
    const spy = jest.spyOn(axios, "put").mockResolvedValue([]);
    const tasks = [
      {
        id: "1",
        name: "Finish course",
        createdOn: now,
        status: TaskStatus.COMPLETE,
      },
    ];

    saveTasks(tasks);

    expect(spy).toHaveBeenCalledWith(
      "https://react-ts-todo-28c59-default-rtdb.firebaseio.com/tasks.json",
      [
        {
          id: "1",
          name: "Finish course",
          createdOn: now,
          status: TaskStatus.COMPLETE,
        },
      ]
    );
  });

  it("saveTasks should return response", async () => {
    jest.spyOn(axios, "put").mockResolvedValue({
      data: [],
      status: 200,
    });

    const putResult = await saveTasks([]);

    expect(putResult).toEqual({
      data: [],
      status: 200,
    });
  });
});
