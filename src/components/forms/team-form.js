import _ from "lodash";
import { useState } from "react";
import Avatar from "../avatar";
import Button from "../button";
import Input from "../inputs/input";
import RadioToggle from "../inputs/radio-toggle";

export default function TeamForm(params) {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <form
    // onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Team Name"
        id="title"
        name="title"
        placeholder="Business"
        //   onBlur={checkleagueCode}
        //   register={register("leagueCode")}
        //   error={errors.leagueCode}
      />
      <RadioToggle label="Public" enabled={isPublic} setEnabled={setIsPublic} />
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div className="flex justify-center">
          <Button
            className="bg-red-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            // onClick={() => setDeleteLeague(true)}
          >
            Delete Team
          </Button>
        </div>
      </div>
      <table className="min-w-full mt-4">
        <thead>
          <tr className="border-t border-gray-200">
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="lg:pl-2">MEMBERS (13)</span>
            </th>
            <th className="py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operation
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {_.map(
            [
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
              { name: "evren" },
            ],
            (team) => (
              <tr className="group group-hover:bg-gray-50" key={team.name}>
                <td className="relative px-6 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500">
                  <div className="flex-shrink-0">
                    <Avatar size={10} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {team.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {team.name}
                    </p>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-500 font-medium">
                  <Button
                    className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    // onClick={() =>
                    //   setDeletedTeam({
                    //     leagueId: league?._id,
                    //     teamId: team?._id,
                    //     userId: team?.user?._id,
                    //   })
                    // }
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </form>
  );
}
