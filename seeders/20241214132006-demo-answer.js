"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("answers", [
      {
        answer:
          "Необходимо написать заявление на перевод (образец можно получить в 115 кабинете главного корпуса), получить необходимые подписи и сдать заявление в 115 кабинет главного корпуса. Далее необходимо подать заявку на обходной лист в системе АИС Платонус. После получения запроса от ВУЗа, в который будет происходить перевод и выхода приказа о переводе - вы сможете забрать документы.",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1, // ID пользователя, создавшего ответ
        modified_by: 1, // ID пользователя, кто последний модифицировал ответ
      },
      {
        answer:
          "Справку можно получить онлайн в системе АИС Платонус, в разделе 'Личный кабинет'.",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "Пройдя по указанной внизу ссылке, вы сможете ознакомиться с условиями перевода в другой вуз.\nhttps://enu.kz/v1/smartapi/serve?path=/general/ﬁles/0c7fea4e-8b98-439e-bdc3-413e09e2f14c.pdf",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "В соответствии с положением возможность перевода на грант в случае потери обучающегося, обучающегося на Гранте, по определенной причине, его высвободившийся грант появляется с предложением по конкурсу в рамках курса и группы образовательных программ, на которых он обучается.",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "В разделе «Документы» нажмите «Новый документ». Выберите вкладку «Из шаблона» и выберите нужный тип договора, например, «Трехсторонний договор на практике».",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "После отправки или подписания договор может иметь статусы, такие как «На подписи», «На согласовании у контрагента» или «Подписан». Все подписанные документы можно просмотреть в подмодуле «Реестр договоров».",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer: "Выдается по социальному положению.",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "К военной подготовке привлекаются студенты, являющиеся гражданами Республики Казахстан, в возрасте до 27 лет, годные по состоянию здоровья к воинской службе. Студенты первого, второго курса, обучающиеся по 4-летнему сроку обучения, и студенты 5 курса, обучающиеся по пятилетнему сроку обучения, а также студенты, зачисленные на второй курс вуза после окончания колледжа, должны пройти медицинское обследование и военно-врачебную экспертизу с целью определения пригодности к военной кафедре (согласно графику).",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "О религиозной деятельности и религиозных объединениях Республики Казахстан от 11 октября 2011 года, в соответствии с законом № 483-IV, разрешение на территории и в зданиях организаций образования не допускается, за исключением религиозных организаций образования.",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
      {
        answer:
          "По адресу: Департамент по социальному гражданскому развитию. Отдел социальных проектов. Ул. А.Янушкевича, №6. №4 корпус. Кабинет №100Б. Контакты: +7 (7172) 70 95 00 вн. 35-120, 35-119.",
        created_at: new Date(),
        modified_at: new Date(),
        created_by: 1,
        modified_by: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("answers", null, {});
  },
};
