import { useState } from "react";
import { useContainerSubscription } from "../store/hooks";

interface IProps {
  containerId: string;
}

const inMemoryData = [
  {
    UserName: "Mikica",
    Books: [{ Name: "Prokleta Avlija", Writer: "Ivo Andric" }],
    UserStatus: "Active",
    YearWhenJoined: "2009",
  },
  {
    UserName: "Perica",
    Books: [{ Name: "Na Drini Cuprija", Writer: "Ivo Andric" }],
    UserStatus: "Inactive",
    YearWhenJoined: "2010",
  },
  {
    UserName: "Mikica",
    Books: [{ Name: "Zimska Pesma", Writer: "Jovan Jovanovic Zmaj" }],
    UserStatus: "Active",
    YearWhenJoined: "2012",
  },
  {
    UserName: "Mikica",
    Books: [{ Name: "Prolecnica", Writer: "Jovan Jovanovic Zmaj" }],
    UserStatus: "Active",
    YearWhenJoined: "2009",
  },
  {
    UserName: "Mikica",
    Books: [{ Name: "Tvrdica", Writer: "Jovan Sterija Popovic" }],
    UserStatus: "Active",
    YearWhenJoined: "2020",
  },
  {
    UserName: "Mikica",
    Books: [{ Name: "Pokondirena Tikva", Writer: "Jovan Sterija Popovic" }],
    UserStatus: "Inactive",
    YearWhenJoined: "2009",
  },
  {
    UserName: "Mikica",
    Books: [{ Name: "Laza i Paralaza", Writer: "Jovan Sterija Popovic" }],
    UserStatus: "Banned",
    YearWhenJoined: "2009",
  },
];

const columnHeaders = ["UserName", "UserStatus", "YearWhenJoined"];

const TestTable = ({ containerId }: IProps) => {
  const [data, setData] = useState(inMemoryData);

  useContainerSubscription(containerId, {
    onChange: () => {
        console.log('triggered')
      // Filter data by exposed state
    },
  }, true);

  return (
    <table>
      <thead>
        <tr>
          {columnHeaders.map((column) => (
            <th>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => (
          <tr>
            {columnHeaders.map((ch) => (
              <td>{row[ch]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TestTable;
