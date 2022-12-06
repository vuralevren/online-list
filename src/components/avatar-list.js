import _ from "lodash";
import Avatar from "./avatar";

export default function AvatarList({ users, totalSize }) {
  return (
    <span className="flex -space-x-2 overflow-hidden">
      {_.map(users, (user, index) => (
        <div key={`${user.userName}-${index}`}>
          <Avatar
            size={8}
            anotherUser={{
              name: user.userName,
              profilePicture: user.profilePicture,
            }}
          />
        </div>
      ))}
      {totalSize > 4 && (
        <Avatar
          size={8}
          anotherUser={{
            name: `+${totalSize}`,
          }}
        />
      )}
    </span>
  );
}
