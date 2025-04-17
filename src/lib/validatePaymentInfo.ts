import { IPaymentData } from "@/types/payment";
import { z } from "zod";

const TransferItemSchema = z.object({
  BeneficiaryAccount: z
    .string({
      required_error:
        "BeneficiaryAccount is required and must be 10 characters",
      invalid_type_error: "BeneficiaryAccount must be a string",
    })
    .length(10),
  beneficiaryBankCode: z
    .string({
      required_error: "beneficiaryBankCode is required",
      invalid_type_error: "beneficiaryBankCode must be a string",
    })
    .min(5),
  amount: z
    .string({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a string",
    })
    .min(6, "amount must contain at least 6 character(s)"),
  ClientAccountNumber: z
    .string({
      required_error:
        "ClientAccountNumber is required and must be 10 characters",
      invalid_type_error: "ClientAccountNumber must be a string",
    })
    .length(10),
  beneficiaryName: z.string({
    required_error: "beneficiaryName is required",
    invalid_type_error: "beneficiaryName must be a string",
  }),
  narration: z.string({
    required_error: "Narration is required",
    invalid_type_error: "narration must be a string",
  }),
  ClientFeeCharge: z.string().optional(),
  SenderName: z.string().optional(),
});

const IPaymentDataSchema = z.object({
  orderInfo: z.object({
    orderId: z.string({
      required_error: "orderId is required",
      invalid_type_error: "orderId must be a string",
    }),
    paymentId: z.string({
      required_error: "paymentID is required",
      invalid_type_error: "paymentId must be a string",
    }),
    paymentType: z.string({
      required_error: "paymentType is required",
      invalid_type_error: "paymentType must be a string",
    }),
  }),
  paymentData: TransferItemSchema,
});

export const validatePaymentData = (data: IPaymentData) => {
  const result = IPaymentDataSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation error:", result.error.errors);
    const formattedErrors = result.error.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
      // value: error.value, // Property 'value' does not exist on type 'ZodIssue'
    }));
    return { success: false, error: formattedErrors };
  }

  return { success: true, data: result.data };
};
