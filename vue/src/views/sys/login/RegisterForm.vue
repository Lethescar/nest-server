<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <!-- <FormItem name="account" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>-->
      <FormItem name="phone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phone"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <!-- <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>-->
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>
      <FormItem name="captcha" class="enter-x" :class="`${prefixCls}-captcha`">
        <Input
          size="large"
          visibilityToggle
          v-model:value="formData.captcha"
          :placeholder="t('sys.login.captcha')"
        />
        <div v-html="captchaObj.img" @click="getNewCaptcha(captchaObj.id)" class="cursor-pointer"></div>
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">{{ t('sys.login.policy') }}</Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >{{ t('sys.login.registerButton') }}</Button>
      <Button
        size="large"
        block
        class="mt-4 enter-x"
        @click="handleBackLogin"
      >{{ t('sys.login.backSignIn') }}</Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, computed } from 'vue';
import LoginFormTitle from './LoginFormTitle.vue';
import { Form, Input, Button, Checkbox } from 'ant-design-vue';
import { StrengthMeter } from '/@/components/StrengthMeter';
// import { CountdownInput } from '/@/components/CountDown';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
import { captcha, register, validateCode } from '/@/api/sys/user';
import { useMessage } from '/@/hooks/web/useMessage';
import { useDesign } from '/@/hooks/web/useDesign';

const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18n();
const { handleBackLogin, getLoginState } = useLoginState();

const formRef = ref();
const loading = ref(false);
const { createMessage } = useMessage();
const { prefixCls } = useDesign('register-form');

const formData = reactive({
  // account: '',
  password: '',
  confirmPassword: '',
  phone: '',
  captcha: '',
  // sms: '',
  policy: false,
});
const captchaObj = reactive({
  img: '',
  id: ''
})

const { getFormRules } = useFormRules(formData);
const { validForm } = useFormValid(formRef);

const getShow = computed(() => {
  const value = unref(getLoginState) === LoginStateEnum.REGISTER
  if (value) {
    getCaptcha()
  }
  return value
});

async function getCaptcha(id?: string) {
  await captcha(id).then(res => {
    const { img, id } = res.data
    captchaObj.id = id
    captchaObj.img = img
  })
}

function getNewCaptcha(id: string) {
  getCaptcha(id)
}

async function restForm() {
  formData.captcha = ''
  await getCaptcha(captchaObj.id)
}

async function resetFields() {
  formData.captcha = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.phone = ''
  formData.policy = false
}

async function handleRegister() {
  const data = await validForm();
  if (!data) return;
  const res = await validateCode({ code: data.captcha, id: captchaObj.id })
  if (res.code === 0) {
    await register({ captchaId: captchaObj.id, ...data }).then(res => {
      createMessage.success(res.msg)
      handleBackLogin()
      resetFields()
    }).catch(async () => {
      await restForm()
    })
  }
}
</script>
<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-register-form";
.@{prefix-cls} {
  &-captcha {
    ::v-deep(.ant-form-item-control-input-content) {
      display: flex;
      svg {
        height: 40px;
      }
    }
  }
}
</style>
