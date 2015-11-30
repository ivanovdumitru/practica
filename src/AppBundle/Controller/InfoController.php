<?php

namespace AppBundle\Controller;



use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Template()
 *
 */
class InfoController extends Controller{
    /**
     *@Route("/info/{i}",name="info")
     */
    function indexAction($i){
          $connect = $this->get('database_connection');
          $connect->executeUpdate('UPDATE `companies` SET `views`=`views`+1 WHERE C='.$i);
          $infos['infol'] = $connect->fetchAll("SELECT * FROM companies where C=".$i);
            $menuRepository = $this->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:Menu');
            $menu['result'] = $menuRepository->showAction();
          $data = [
              'menu'=>$menu['result'],
              'info'=>$infos['infol'],
          ];
          return $this->render('AppBundle:Company:list.html.twig',compact('data'));   
    }
} 