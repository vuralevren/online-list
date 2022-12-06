import Avatar from "../avatar";
import Button from "../button";
import Input from "../inputs/input";
import _ from "lodash";
import { useState } from "react";
import RadioToggle from "../inputs/radio-toggle";

export default function ListForm(params) {
  const [isPublic, setIsPublic] = useState(true);

  return (
    <form
    // onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="List Name"
        id="title"
        name="title"
        placeholder="Tomato"
        //   onBlur={checkleagueCode}
        //   register={register("leagueCode")}
        //   error={errors.leagueCode}
      />
      <div className="my-3">
        <RadioToggle
          label="Public"
          enabled={isPublic}
          setEnabled={setIsPublic}
        />
      </div>
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div className="flex justify-center">
          <Button
            className="bg-red-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            // onClick={() => setDeleteLeague(true)}
          >
            Delete List
          </Button>
        </div>
      </div>
    </form>
  );
}
