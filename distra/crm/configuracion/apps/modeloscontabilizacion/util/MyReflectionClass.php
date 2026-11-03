<?php

if (!class_exists('MyReflectionClass')) {

    /**
     * Variante de la clase nativa ReflectionClass.
     * 
     * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
     * @package ERP Cuba.
     * @copyright (c) 2014, XETID.
     */
    class MyReflectionClass extends ReflectionClass
    {

        private $class;

        public function __construct($argument)
        {
            parent::__construct($argument);
            $this->class = $argument;
        }

        /**
         * (non-PHPdoc)
         * @see ReflectionClass::getMethods()
         */
        public function getMethods($filter = null, $useAndOperator = true)
        {
            if ($useAndOperator !== true) {
                return parent::getMethods($filter);
            }

            $methods = parent::getMethods($filter);
            $results = array();

            foreach ($methods as $method) {
                if (($method->getModifiers() & $filter) === $filter) {
                    $results[] = $method;
                }
            }

            return $results;
        }

    }

}
