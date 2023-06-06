-- CreateTable
CREATE TABLE "fitness_center" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "fitness_center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_advice" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "member_id" UUID NOT NULL,
    "health_advisor_id" UUID NOT NULL,
    "advice_details" TEXT NOT NULL,

    CONSTRAINT "health_advice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_metric" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "member_id" UUID NOT NULL,
    "metric_name" VARCHAR(255) NOT NULL,
    "metric_value" INTEGER NOT NULL,

    CONSTRAINT "health_metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "fitness_center_id" UUID NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "member_id" UUID NOT NULL,
    "fitness_instructor_id" UUID NOT NULL,
    "plan_details" TEXT NOT NULL,

    CONSTRAINT "workout_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "fitness_center" ADD CONSTRAINT "fitness_center_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "health_advice" ADD CONSTRAINT "health_advice_health_advisor_id_fkey" FOREIGN KEY ("health_advisor_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "health_advice" ADD CONSTRAINT "health_advice_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "health_metric" ADD CONSTRAINT "health_metric_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_fitness_center_id_fkey" FOREIGN KEY ("fitness_center_id") REFERENCES "fitness_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workout_plan" ADD CONSTRAINT "workout_plan_fitness_instructor_id_fkey" FOREIGN KEY ("fitness_instructor_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workout_plan" ADD CONSTRAINT "workout_plan_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

