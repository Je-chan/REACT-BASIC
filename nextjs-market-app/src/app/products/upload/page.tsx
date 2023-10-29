"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ImageUpload from "@/components/ImageUpload";
import { categories } from "@/components/categories/Categories";
import CategoryInput from "@/components/categories/CategoryInput";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProductUploadPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      latitude: 33.5563,
      longitude: 126.79581,
      imageSrc: "",
      price: 100,
    },
  });

  // 이렇게 하면, useForm Field 인 imageSrc 가 변경될 때마다 할당해준 변수 imageSrc 의 값이 state 처럼 자동으로 변경된다.
  const imageSrc = watch("imageSrc");

  const category = watch("category");

  /**
   *  KakaoMap 은 dynamic import 로 가져와야 한다.
   *
   *  Dynamic Import 란?
   *  - 모듈을 빌드 타임이 아닌 런타임에 불러오도록 한다
   *  - 이 방식을 사용하면 번들 파일을 분리하고 퍼포먼스가 향상될 수 있다.
   *    - (1) 초기 로딩 시 사이즈가 크거나 초기 로딩부터 사용하지 않을 때
   *    - (2) 런타임에만 알 수 있는 정보에 기반해서 모듈을 가져와야 할 때
   */
  const KakaoMap = dynamic(() => import("../../../components/KakaoMap"), {
    ssr: false,
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  // setCustomValue 를 하는 이유는 useFrom 에서 사용하는 register 함수를 사용하고 있지 않기 때문에 사용하는 것
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log("ON SUBMIT");
    setIsLoading(true);

    axios
      .post("/api/products", data)
      .then((res) => {
        router.push(`/products/${res.data.id}`);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
          <Heading title="Product Upload" subtitle="upload your product" />
          <ImageUpload
            onChange={(value) => setCustomValue("imageSrc", value)}
            value={imageSrc}
          />
          <hr />

          <Input
            id="title"
            label="Title"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <hr />
          <Input
            id="description"
            label="Description"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <hr />

          <Input
            id="price"
            label="Price"
            formatPrice
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <hr />

          <div
            className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-3
                            max-h-[50vh]
                            overflow-y-auto
                        "
          >
            {categories.map((item) => (
              <div key={item.label} className={"col-span-1"}>
                <CategoryInput
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  onClick={(category) => setCustomValue("category", category)}
                  selected={category === item.path}
                />
              </div>
            ))}
          </div>

          <hr />

          <KakaoMap
            setCustomValue={setCustomValue}
            latitude={latitude}
            longitude={longitude}
          />

          <Button label="상품 생성하기" />
        </form>
      </div>
    </Container>
  );
};

export default ProductUploadPage;
