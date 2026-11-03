<?php 
class ReporteFilterValidator extends BaseValidator
{

    public function validateInsert($values)
    {
        $this->validateArrayArgumentValues($values, $this->getInsertArgumentsConfig());
        $this->validateDuplicationValues('ReporteFilterRepository', $this->getInsertDuplicationTerms($values));
    }

    public function validateUpdate($values)
    {
        $this->validateArrayArgumentValues($values, $this->getUpdateArgumentsConfig());
        $this->validateDuplicationValues('ReporteFilterRepository', $this->getUpdateDuplicationTerms($values));
    }

    public function validateDelete($idsfiltro)
    {
        if(is_array($idsfiltro) && count($idsfiltro))
        {
            foreach($idsfiltro as $value)
                $this->validateDeleteArgument($value);
        }else
            $this->validateDeleteArgument($idsfiltro);
    }

    private function getInsertDuplicationTerms($values)
    {
        return array(
            1 => array('equalDenom'=> $values['denominacion'])
        );
    }

    private function getUpdateDuplicationTerms($values)
    {
        $insertTerms = $this->getInsertDuplicationTerms($values);

        foreach($insertTerms as &$elem)
            $elem['distinctId'] = $values['idfiltro'];

        return $insertTerms;
    }

    private function getInsertArgumentsConfig()
    {
        return array(
            'idfiltro' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 50,
                'regex' => '/^[0-9a-zA-Z]+$/'
            ),
            'denominacion' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 100,
                'regex' => '/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/'
            ),
            'orden' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 2
            ),
            'anchocolumna' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 4
            ),
            'nombreparametro' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 50,
                'regex' => '/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/'
            ),
            'tipo' => array(
                'empty' => false,
                'minValue' => 0,
                'maxValue' => 9
            ),
            'idreporte' => array(
                'empty' => false,
                'minLength' => 0,
                'maxLength' => 19
            ),
            'longitudminima' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 3
            ),
            'longitudmaxima' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 3
            ),
            'valorminimo' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 10
            ),
            'valormaximo' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 10
            ),
            'nomidentificador' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 100,
                'regex' => '/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/'
            ),
            'nomdenominacion' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 100,
                'regex' => '/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d_]+(\d*)?)+$/'
            ),
            'tipofuentedatos' => array(
                'empty' => true,
                'minValue' => 0,
                'maxValue' => 9
            ),
            'sentenciasql' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 255
            ),
            'nomservicio' => array(
                'empty' => true,
                'minLength' => 0,
                'maxLength' => 255
            ),
        );
    }

    private function getUpdateArgumentsConfig()
    {
        $insertArg = $this->getInsertArgumentsConfig();

        $insertArg['idfiltro'] = array(
            'empty' => false,
            'minLength' => 0,
            'maxLength' => 19,
        );

        return $insertArg;
    }

    private function validateDeleteArgument($value)
    {
        $this->validateArgumentValues(
            array(
                'empty' => false,
                'minValue' => 0,
                'maxValue' => 999999999999999999,
            ),
            $value, 'idsfiltro'
        );
    }
}