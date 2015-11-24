<?php

namespace B2B\BlogBundle\Controller;

use B2B\BlogBundle\Entity\PostMetaRepository;
use B2B\BlogBundle\Entity\CompanyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Template()
 */

class DefaultController extends Controller
{
    /**
     * @param Request $request
     * @param int $page
     * @param null $subjectId
     * @return \Symfony\Component\HttpFoundation\Response
     * @Route("/{page}/{subjectId}", requirements={"page": "\d+", "subjectId": "\d+"}, defaults={"page": 1, "subjectId": null}, name="home")
     */
    public function homeAction(Request $request, $page=1, $subjectId = null)
    {
        /**
         * @var $repo PostMetaRepository
         */
        // article list
        
        switch($subjectId){
            case '3':{
                 $articlesPerPage = 12;
                 $apiUrl = $this->container->getParameter('api')['articles_list_url'];
                 $offset = $page * $articlesPerPage - $articlesPerPage; // since previous page
                 $url = sprintf('%s?limit=%d&offset=%d', $apiUrl, $articlesPerPage, $offset);
                if ($subjectId !== null) {
                 $url .= sprintf('&subject=%d', $subjectId);
                }
              
          /*  $company = $this->getDoctrine()
              ->getRepository('B2BBlogBundle:Company');
              $query = $this->getEntityManager()
                ->createQuery('SELECT * From companyy');
              return $querys->mysql_fetch_array($query);
                  */
              /*  $em = $this->getDoctrine()
               ->getEntityManager();
          $company['result'] = $em->getRepository('B2BBlogBundle:Company')
                ->getLatestCompany(1,12);*/
 
              $connect = $this->get('database_connection');
              $rezult = $connect->fetchAll('select * from companies');
              
              $count = 0;
              foreach($rezult as $item){
                  $count++;
              }
              $j=0;
              $l=12;
              $connect = $this->get('database_connection');
            $company['result']= $connect->fetchAll('select * from companies  LIMIT 12');
            $rez= $count/12;
           $company['respopular'] = $connect->fetchAll('SELECT * FROM companies order by views DESC limit 5');
//this doesn't work
            $data = [
              'b'=>1,
              'popular' => $company['respopular'], 
              'company' => $company['result'],
              'count' =>  ceil($rez),
              'subjects' => $this->get('post.utility')->subjects(),
              'title' => 'ome',
            
        ];
               return $this->render('B2BBlogBundle:Default:index2.html.twig', compact('data')); 
             }
              break;
              case '4':{
                 $articlesPerPage = 12;
                 $apiUrl = $this->container->getParameter('api')['articles_list_url'];
                 $offset = $page * $articlesPerPage - $articlesPerPage; // since previous page
                 $url = sprintf('%s?limit=%d&offset=%d', $apiUrl, $articlesPerPage, $offset);
                if ($subjectId !== null) {
                 $url .= sprintf('&subject=%d', $subjectId);
                }
          
              $connect = $this->get('database_connection');
              $rezult = $connect->fetchAll('select * from items');
              
              $count = 0;
              foreach($rezult as $item){
                  $count++;
              }
              $j=0;
              $l=12;
              $connect = $this->get('database_connection');
            $company['result']= $connect->fetchAll('select * from items  LIMIT 12');
            $rez= $count/12;
            $company['respopular'] = $connect->fetchAll('SELECT * FROM companies order by views DESC limit 5');
//this doesn't work
            $data = [
              'a'=>1,
              'b'=>1,
              'items' => $company['result'],
              'count' =>  ceil($rez),
              'subjects' => $this->get('post.utility')->subjects(),
              'title' => 'ome',
              'popular' => $company['respopular'],
            
        ];
               return $this->render('B2BBlogBundle:Default:index2.html.twig', compact('data')); 
             }break;
            default:{
        $articlesPerPage = $this->container->getParameter('page')['front_page_articles_per_page'];
        $apiUrl = $this->container->getParameter('api')['articles_list_url'];
        // pagination
        $offset = $page * $articlesPerPage - $articlesPerPage; // since previous page
        $url = sprintf('%s?limit=%d&offset=%d', $apiUrl, $articlesPerPage, $offset);
        if ($subjectId !== null) {
            $url .= sprintf('&subject=%d', $subjectId);
        }
        $httpResponse = $this->get('buzz.curl')->request($url);
        $articles = json_decode($httpResponse->getContent(), true);
        // views counter
        $repo = $this->getDoctrine()->getRepository('B2BBlogBundle:PostMeta');
        $ids = $count = [];
        foreach ($articles['results'] as $article) {
            $ids[] = $article['id'];
        }
        foreach ($repo->getCount($ids) as $postData) {
            $count[$postData['postId']] = $postData['value'];
        }
        // assemble final data
        $data = [
           'articles' => $articles['results'],
            'count' =>  $count,
            'subjects' => $this->get('post.utility')->subjects(),
            'title' => 'ome',
            'popular' => $this->get('post.utility')->popular(5),
            'pagination' => ceil($articles['count'] / $this->container->getParameter('page')['front_page_articles_per_page'])
            
        ];
        
        return $this->render('B2BBlogBundle:Default:index.html.twig', compact('data'));
        
         }
        }
    }

}
