import Button from "../button";
import Input from "../inputs/input";

export default function TodoForm(params) {
  return (
    <form
    // onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Title"
        id="title"
        name="title"
        placeholder="Tomato"
        //   onBlur={checkleagueCode}
        //   register={register("leagueCode")}
        //   error={errors.leagueCode}
      />
      <Input
        label="Description"
        id="description"
        name="description"
        placeholder="You should buy it."
        textArea
        //   register={register("teamName")}
        //   disabled={!codeAvailable || errors.leagueCode}
        //   error={errors.teamName}
      />

      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div className="flex justify-center">
          <Button
            className="bg-red-600 border w-full border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            // onClick={() => setDeleteLeague(true)}
          >
            Delete Todo
          </Button>
        </div>
      </div>
    </form>
  );
}
