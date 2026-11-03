<?php 
class BaseValidator
{
    protected function validateArgumentValues($config, $value, $valueName)
    {
        $result = $this->validateValue($config, $value, $valueName);
        if(count($result) > 0)
            throw new InvalidArgumentsException(implode(' ', $result), 3);
    }

    protected function validateArrayArgumentValues($values, $config)
    {
        foreach($config as $elemName => $elemConfig)
            $this->validateArgumentValues($elemConfig, $values[$elemName], $elemName);
    }

    protected function validateDuplicationValues($className, $exceptionConfig)
    {
        $repository = new $className();

        foreach($exceptionConfig as $errorCode => $filters)
        {
            if($repository->getCountRecords($filters) != 0)
                throw new DuplicationValuesException(null, $errorCode);
        }
    }

    protected function validateValue($config = array(), $value = '', $valueName = 'parámetro')
    {
        $validator = new Zend_Validate();

        $validator = $this->decorateNotEmptyValidator($validator, $config, $valueName);
        $validator = $this->decorateStringLengthValidator($validator, $config, $valueName);
        $validator = $this->decorateBetweenValidator($validator, $config, $valueName);
        $validator = $this->decorateRegexValidator($validator, $config, $valueName);

        $validator->isValid($value);
        $validatorMsg = $validator->getMessages();

        if(array_key_exists('isEmpty', $validatorMsg) && $config['empty'] === true)
            return array();

        return $validatorMsg;
    }

    private function decorateBetweenValidator($validator, $config, $valueName)
    {
        if(array_key_exists('minValue', $config) && array_key_exists('maxValue', $config))
        {
            $betweenValidator = new Zend_Validate_Between($config['minValue'], $config['maxValue']);

            $betweenValidator->setMessage(
                $valueName.' no se encuentra entre %min% y %max%.',
                Zend_Validate_Between::NOT_BETWEEN
            );

            $betweenValidator->setMessage(
                $valueName.' no se encuentra estrictamente entre %min% y %max%.',
                Zend_Validate_Between::NOT_BETWEEN_STRICT
            );

            $validator->addValidator($betweenValidator);
        }
        return $validator;
    }

    private function decorateStringLengthValidator($validator, $config, $valueName)
    {
        if(array_key_exists('minLength', $config) && array_key_exists('maxLength', $config))
        {
            $rangeValidator = new Zend_Validate_StringLength($config['minLength'], $config['maxLength']);

            $rangeValidator->setMessage(
                $valueName.' tiene más de %max% caracteres de longitud.',
                Zend_Validate_StringLength::TOO_LONG
            );

            $rangeValidator->setMessage(
                $valueName.' tiene menos de %min% caracteres de longitud.',
                Zend_Validate_StringLength::TOO_SHORT
            );

            $validator->addValidator($rangeValidator);
        }
        return $validator;
    }

    private function decorateRegexValidator($validator, $config, $valueName)
    {
        if(array_key_exists('regex', $config))
        {
            $regexValidator = new Zend_Validate_Regex($config['regex']);
            $regexValidator->setMessage($valueName.' no machea con el patrón %pattern%');

            $validator->addValidator($regexValidator);
        }
        return $validator;
    }

    private function decorateNotEmptyValidator($validator, $config, $valueName)
    {
        if(array_key_exists('empty', $config))
        {
            $emptyValidator = new Zend_Validate_NotEmpty();
            $emptyValidator->setMessage($valueName.' es requerido y no puede ser vacío.');

            $validator->addValidator($emptyValidator);
        }
        return $validator;
    }
}