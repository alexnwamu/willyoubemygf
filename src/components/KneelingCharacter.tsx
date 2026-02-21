"use client";

import Image from "next/image";
import characterImg from "../assets/wybmgf.png";

const KneelingCharacter = ({
  className = "w-full max-w-sm mx-auto",
  happy = false,
}: {
  className?: string;
  happy?: boolean;
}) => {
  return (
    <div className={className}>
      <Image
        src={characterImg}
        alt="Kneeling character"
        style={{ width: "100%", height: "auto" }}
        priority
      />
    </div>
  );
};

export default KneelingCharacter;
