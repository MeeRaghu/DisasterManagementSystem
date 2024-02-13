import React from "react";
import organizations from "./NGOs.json";

const NGOList = () => {
  function generateRandomIndianPhoneNumber() {
    const randomNumber = () =>
      Math.floor(Math.random() * 900000000) + 910000000;
    return `9${randomNumber()}`;
  }
  return (
    <div className="container mx-auto mb-16">
      <div className="text-4xl text-center font-bold mb-8">
        Top 10 NGOs working for Disaster Management
      </div>

      <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-xl">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Sr No.</th>
            <th className="py-2 px-4 border-b">Name of VO/NGO</th>
            <th className="py-2 px-4 border-b">
              Registration No., City & State
            </th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Phone No.</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="py-2 px-4 border-b">{org["Sr No."]}</td>
              <td className="py-2 px-4 border-b">{org["Name of VO/NGO"]}</td>
              <td className="py-2 px-4 border-b">
                {org["Registration No.,City & State"]}
              </td>
              <td className="py-2 px-4 border-b">{org["Address"]}</td>
              <td className="py-2 px-4 border-b">
                <a href="tel">{generateRandomIndianPhoneNumber()}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NGOList;
