<?php

/**
 * Temporary autoloader to ensure compatibility with old, non-PSR-2 compliant classes.
 *
 * @author Jaime Pérez Crespo <jaime.perez@uninett.no>
 * @package SimpleSAMLphp
 */

/**
 * Autoload function that looks for classes migrated to PSR-2.
 *
 * @param string $className Name of the class.
 */
function SAML2_autoload($className)
{
        // handle classes that have been renamed
        $renamed = array(
            'SAML2_Const' => 'SAML2_Constants',
        );
        $oldName = $className;
        if (array_key_exists($className, $renamed)) {
            $className = $renamed[$className];
        }
        if(strrpos($className,'_'))
            $file = dirname(__FILE__) . '/' . str_replace('_', '/', $className) . '.php';
        else
            $file = dirname(__FILE__) . '/' . str_replace('\\', '/', $className) . '.php';
        if (file_exists($file)) {
            require_once($file);
            $newName = '\\' . str_replace('_', '\\', $className);
            class_alias($newName, $oldName);
        }
    }
spl_autoload_register('SAML2_autoload');
