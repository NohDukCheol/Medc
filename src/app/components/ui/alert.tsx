import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

/**
 * 알림 컴포넌트의 스타일 변형 정의 (CVA 사용)
 */
const alertVariants = cva(
  // 기본 레이아웃 및 공통 스타일
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        // 기본 스타일: 카드 배경색에 텍스트
        default: "bg-card text-card-foreground",
        // 위험/에러 스타일: 파괴적인 액션 강조색 적용
        destructive:
          "text-destructive bg-card [&>svg]:text-current", 
          // 피그마 전용 data-slot 선택자 제거 (대신 AlertDescription에서 직접 처리)
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * 메인 Alert 컨테이너 컴포넌트
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert" // 접근성 보장을 위한 속성
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * Alert의 제목 영역 컴포넌트
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Alert의 상세 설명 영역 컴포넌트
 */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };