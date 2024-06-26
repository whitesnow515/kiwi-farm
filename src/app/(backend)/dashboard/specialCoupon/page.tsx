"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectProducts } from "@/store/features/products/productsSlice";
import { getProducts } from "@/store/features/products/productsSlice";
import _ from 'lodash';

const newCouponSchema = z.object({
  product: z.number().min(0, { message: "Product is required." }),
  quantify: z.number().min(0, { message: "Quantity must be over 0." }),
  price: z.number().min(0, { message: "Discount must be over 0." }),
});

export interface ICoupons {
  id: string;
  quantify: number;
  product: Array<{product: string, price: number}>;
  price: number;
}

export default function Home(){
  const [isLoading, setIsLoading] = useState(false)
  const [id, setId] = useState<string | null>("all")
  const [selectedProduct, setSelectedProduct] = useState<string | null>("");
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);

  const form = useForm<z.infer<typeof newCouponSchema>>({
    resolver: zodResolver(newCouponSchema),
    defaultValues: {
      product: 0,
      quantify: 0,
      price: 0,
    },
  });

  const handleChange = (event: any) => {
    setSelectedProduct(event.target.value);
    let product = products.find(p=> Number(p.id) === Number(event.target.value)).s_coupon;
    if (Number(selectedProduct) !== -1) {
      form.setValue('price', Number(product?.price || 0));
      form.setValue('quantify', Number(product?.qty || 0));
    }else{
      form.setValue('price', 0);
      form.setValue('quantify', 0);
    }
  }

  async function onSubmit(values: z.infer<typeof newCouponSchema>){
    try {
      setIsLoading(true);
      let temp = _.cloneDeep(products.find(p=> Number(p.id) === Number(selectedProduct)));
      temp.s_coupon = {price: Number(form.getValues('price')), qty: Number(form.getValues('quantify'))};
      console.log(temp);
      const formData = new FormData();
      Object.keys(temp).map((key, index)=>{
        if (key === 'flavor' || key === 's_coupon') {
          formData.append(key, JSON.stringify(temp[key]));
        }else{
          formData.append(key, temp[key]);
        }
      });
      const response = await fetch("/api/products/update", {
        method: "POST",
        body: formData,
      });
      
      if (response.status === 200) {
        toast.success("You update the current coupon!.");
        dispatch(getProducts({ type: "all", user: '12' }));
      }else {
        const error = await response.json();
        toast.error(error);
      }
      
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  }

  const priceChange = (event: any) =>{
    const value = parseInt(event.target.value);
    if (value < 0 || value > 100) {
      return;
    }
    form.setValue("price", value);
  }

  const discountQty = (event: any) =>{
    const value = parseInt(event.target.value);
    form.setValue("quantify", value);
  }

  return(
    <div className="">
      <h2 className="text-2xl py-3 self-center text-center">Manage Special Coupons</h2>
      <div className="flex flex-row flex-wrap bg-accent rounded-sm p-6 justify-evenly sm:gap-6 gap-4 max-w-[900px] mx-auto mt-6">
        <div className="max-w-[600px] mx-auto px-2">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-grow md:flex-row flex-wrap text-left  items-center gap-2 px-6 space-y-4">
                  <div className="mt-0 w-full min-w-[128px]">
                    <FormField
                      control={form.control}
                      name="product"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-wrap justify-center gap-3">
                          <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                            Product :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-6/12 min-w-[128px] max-w-[350px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <select 
                                className='mx-0 w-full bg-white text-sm py-2 my-4 shadow-sm focus-visible:outline-none bg-transparent border-[1px] rounded-md' 
                                value={selectedProduct} 
                                onChange={handleChange}
                                >
                                <option value="" disabled>Select Product</option>
                                {products.map((item, index) => (
                                  <option key={index} value={item.id}>{item.title}</option>
                                ))}
                              </select>
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-0 w-full min-w-[128px]">
                    <FormField
                      control={form.control}
                      name="quantify"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-wrap justify-center gap-3">
                          <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                            Quantify :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-6/12 min-w-[128px] max-w-[350px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                type="number"
                                min={0}
                                className="bg-white mt-0"
                                placeholder="Input Quantify"
                                onChange={discountQty}
                                value={field.value}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-0 w-full min-w-[128px]">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-wrap justify-center gap-3">
                          <FormLabel className="w-4/12 min-w-[90px] max-w-[100px] self-center ">
                            Price :
                          </FormLabel>
                          <FormControl
                            className="w-8/12 sm:w-6/12 min-w-[128px] max-w-[350px] "
                            style={{
                              marginTop: 0,
                            }}
                          >
                            <div>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                className="bg-white mt-0"
                                onChange={priceChange}
                                value={field.value}
                              />
                              <FormMessage className="absolute" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <input type="hidden" value={id}>
                  </input>
                  <div className="w-full text-center">
                    <Button
                      className={"bg-[#017c6b] hover:bg-[#009688] w-32 h-12 mt-2 "}
                      type="submit"
                      disabled={isLoading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}